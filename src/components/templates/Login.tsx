import { h } from "hyperapp";
import Actions from "../../Actions";
import { pstyle } from "../../polyfills/picostyle";
import { IState } from "../../State";
import PostList from "../organisms/PostList";
import TopicList from "../organisms/TopicList";
import {Redirect} from "@hyperapp/router"
import { typetalkApi } from "../../Api";
import { IAccessToken } from "../../typetalk/Models";
import { IpostMessage } from "../../typetalk/Streaming";
import Container from "./Container";

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

const url = "https://typetalk.com/oauth2/authorize?client_id=B1ZFrQt0kTgw2vRsZzJROsq3HdhGHcDL&scope=my,topic.read,topic.post&redirect_uri=http://localhost&response_type=code";

export default (state: IState, actions: Actions) => {
    const authWindow = new BrowserWindow({width: 800, height: 600});
    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        var matched;
        if(matched = newUrl.match(/\?code=([^&]*)/)) {
            typetalkApi.auth(matched[1]).then(() => {
                actions.login();
                setTimeout(() => {
                    authWindow.close();
                }, 0);
            });
        }
    });

  authWindow.on('closed', a => {
    (async () => {
    const topics = await typetalkApi.getTopics();
    actions.topics(topics);

    typetalkApi.startStreaming();
    typetalkApi.addEventListener("postMessage", stream => {
        const { data } = stream as IpostMessage;
        actions.post(data.post);
    });
    })();
  });

  authWindow.loadURL(url)

  return (
    <div>
      <div class="login">
        Logining...
      </div>
    </div>
  );
};
