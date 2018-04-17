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

const url = typetalkApi.getAuthUrl()

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
    typetalkApi.initFetch(actions)
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
