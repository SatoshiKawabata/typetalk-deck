import { app } from "hyperapp";
import Actions from "./Actions";
import { typetalkApi } from "./Api";
import routes from "./components/templates/Routes"
import { state } from "./State";
import { IpostMessage } from "./typetalk/Streaming";


const tokenStr = localStorage.getItem("auth_token");
if(tokenStr != null) {
  typetalkApi.setToken(JSON.parse(tokenStr));
}

const actions = app(state, new Actions(), routes, document.body);

if(tokenStr != null) {
    actions.login();
    (async () => {
      const topics = await typetalkApi.getTopics();
      actions.topics(topics);

      // streaming
      typetalkApi.startStreaming();
      typetalkApi.addEventListener("postMessage", stream => {
        const { data } = stream as IpostMessage;
        actions.post(data.post);
      });
      // 自分のプロフィールを取得しておく
      const selfProfile = await typetalkApi.getProfile();
      actions.selfProfile(selfProfile);
    })();
}
