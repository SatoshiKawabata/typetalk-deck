import * as querystring from "querystring";
import { IAccessToken, IMessageList, IPost, IPostParam, IProfile, IReplies, ITopic, ITopics, ILike } from "./Models";
import Streaming, { IStreaming, StreamingEvent } from "./Streaming";
const request = require('request');

const secret = querystring.parse(location.search.split("?")[1]);
const CLIENT_ID = secret.client_id;
const CLIENT_SECRET = secret.client_secret;

/**
 * Typetalk api
 */
export default class TypeTalk {
  private token!: IAccessToken;
  private streaming: Streaming;
  private streamingHandlers: Map<StreamingEvent, Array<(stream: IStreaming) => void>>;

  constructor() {
    this.streamingHandlers = new Map();
  }

  setToken(token: IAccessToken) {
    this.token = token;
    localStorage.setItem("auth_token", JSON.stringify(this.token));
  }

  auth(code: string): Promise<void> {
    const params = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: "http://localhost",
        grant_type: "authorization_code"
    };

    const options = {
        url: "https://typetalk.com/oauth2/access_token",
        json: params
    };

    return new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        if(error != null) {
          reject()
        }
        this.setToken(body as IAccessToken);
        resolve()
      })
    })
  }

  getNewToken() {
    const refreshToken = this.token.refresh_token
    this.token = null
    return this.postMethod<IAccessToken>("https://typetalk.com/oauth2/access_token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }).then((token) => {
      this.setToken(token)
      return token;
    });
  }

  getProfile() {
    return this.tryConnect(() => this.getMethod<IProfile>("https://typetalk.com/api/v1/profile"));
  }

  getTopics() {
    return this.tryConnect(() => this.getMethod<ITopics>("https://typetalk.com/api/v1/topics"));
  }

  getMessageList(topicId: number, fromId: number = null) {
    return this.tryConnect(() => this.getMethod<IMessageList>(`https://typetalk.com/api/v1/topics/${topicId}`,
      fromId ? {from: fromId} : null
    ));
  }

  getPost(topicId: number, postId: number) {
    return this.tryConnect(() => this.getMethod<IPost>(`https://typetalk.com/api/v1/topics/${topicId}/posts/${postId}`))
  }

  getReplies(topicId: number,  postId: number) {
    return this.tryConnect(() => this.getMethod<IReplies>(`https://typetalk.com/api/v1/topics/${topicId}/posts/${postId}/replies`));
  }

  post(topicId: number, param: IPostParam) {
    return this.tryConnect(() => this.postMethod<{
      topic: ITopic,
      psot: IPost,
      mentions: string[]
    }>(`https://typetalk.com/api/v1/topics/${topicId}`, param).catch(() => {
      this.getNewToken().then(() => this.post(topicId, param));
    }));
  }

  addEventListener(evtName: StreamingEvent, handler: (stream: IStreaming) => void) {
    let handlers = this.streamingHandlers.get(evtName);
    if (handlers) {
      handlers.push(handler);
    } else {
      handlers = [handler];
    }
    this.streamingHandlers.set(evtName, handlers);
  }

  startStreaming() {
    this.streaming = new Streaming();
    this.streaming.start(msg => {

      const handlers = this.streamingHandlers.get(msg.type);
      if (handlers) {
        handlers.forEach(h => {
          h(msg);
        });
      }
      // // debug
      // console.log(msg);
      // const data = localStorage.getItem(msg.type);
      // if (!data) {
      //   localStorage.setItem(msg.type, JSON.stringify(msg));
      // }
    });
  }

  like(topicId: number, postId: number) {
    return this.postMethod<ILike>(`https://typetalk.com/api/v1/topics/${topicId}/posts/${postId}/like`, {});
  }

  unlike(topicId: number, postId: number) {
    return this.deleteMethod<ILike>(`https://typetalk.com/api/v1/topics/${topicId}/posts/${postId}/like`, {});
  }
  tryConnect(connect: Function) {
    return connect().catch(() => 
      this.getNewToken().then(() => connect())
    )
  }

  private postMethod = <T>(url: string, param: any): Promise<T> => {
    return new Promise<T>((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if(xhr.status === 200){
          res(JSON.parse(xhr.response));
        }
        rej(xhr.response)
      };
      xhr.onerror = () => {
        rej(JSON.parse(xhr.response));
      };
      xhr.open("POST", url);
      if (this.token) {
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${this.token.access_token}`
        );
      }
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(param));
      return xhr;
    });
  }

  // private getNewToken() {
  //   return new Promise<T>((res, rej) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = () => {
  //       res(JSON.parse(xhr.response));
  //     };
  //     xhr.onerror = () => {
  //       rej(JSON.parse(xhr.response));
  //     };
  //     xhr.open("POST", url);
  //     if (this.token) {
  //       xhr.setRequestHeader(
  //         "Authorization",
  //         `Bearer ${this.token.access_token}`
  //       );
  //     }
  //     xhr.setRequestHeader("Content-Type", "application/json");
  //     xhr.send(JSON.stringify(param));
  //     return xhr;
  //   });
  // }

  private getMethod = <T>(url: string, query: any = null): Promise<T> => {
    return new Promise<T>((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if(xhr.status === 200){
          res(JSON.parse(xhr.response));
        }
        rej(xhr.response)
      };
      xhr.onerror = () => {
        rej(JSON.parse(xhr.response));
      };
      xhr.open("GET", `${url}?${querystring.stringify(query)}`);
      if (this.token) {
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${this.token.access_token}`
        );
      }
      xhr.send();
      return xhr;
    });
  }

  private deleteMethod = <T>(url: string, param: any): Promise<T> => {
    return new Promise<T>((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        res(JSON.parse(xhr.response));
      };
      xhr.onerror = () => {
        rej(JSON.parse(xhr.response));
      };
      xhr.open("DELETE", url);
      if (this.token) {
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${this.token.access_token}`
        );
      }
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(param));
      return xhr;
    });
  }
}
