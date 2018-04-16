import * as querystring from "querystring";
import { IAccessToken, IMessageList, IPost, IPostParam, IProfile, IReplies, ITopic, ITopics } from "./Models";
import Streaming, { IStreaming, StreamingEvent } from "./Streaming";

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

  getToken() {
    return this.postMethod<IAccessToken>("https://typetalk.com/oauth2/access_token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "my,topic.read,topic.post"
    }).then((token) => {
      this.token = token;
      return token;
    });
  }

  getProfile() {
    return this.getMethod<IProfile>("https://typetalk.com/api/v1/profile");
  }

  getTopics() {
    return this.getMethod<ITopics>("https://typetalk.com/api/v1/topics");
  }

  getMessageList(topicId: number, fromId: number = null) {
    return this.getMethod<IMessageList>(`https://typetalk.com/api/v1/topics/${topicId}`,
      fromId ? {from: fromId} : null
    );
  }

  getPost(topicId: number, postId: number) {
    return this.getMethod<IPost>(`https://typetalk.com/api/v1/topics/${topicId}/posts/${postId}`);
  }

  getReplies(topicId: number,  postId: number) {
    return this.getMethod<IReplies>(`https://typetalk.com/api/v1/topics/${topicId}/posts/${postId}/replies`);
  }

  post(topicId: number, param: IPostParam) {
    return this.postMethod<{
      topic: ITopic,
      psot: IPost,
      mentions: string[]
    }>(`https://typetalk.com/api/v1/topics/${topicId}`, param);
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

  private postMethod = <T>(url: string, param: any): Promise<T> => {
    return new Promise<T>((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        res(JSON.parse(xhr.response));
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

  private getMethod = <T>(url: string, query: any = null): Promise<T> => {
    return new Promise<T>((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        res(JSON.parse(xhr.response));
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
}