import { app } from "hyperapp";
import Actions from "./Actions";
import { typetalkApi } from "./Api";
import Container from "./components/templates/Container";
import { state } from "./State";
import { IpostMessage } from "./typetalk/Streaming";

const actions: Actions = app(state, new Actions(), Container, document.body);

// initialize
(async () => {
  await typetalkApi.getToken();

  // トピックを取得
  const topics = await typetalkApi.getTopics();
  actions.topics(topics);

  // Streaming apiからイベントを受け取る
  typetalkApi.startStreaming();
  typetalkApi.addEventListener("postMessage", stream => {
    const { data } = stream as IpostMessage;
    actions.post(data.post);
  });
})();
