import { h } from "hyperapp";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { IPostParam, ITopic } from "../../typetalk/Models";
import "./Input.css";

export default ({ actions, topic, replyTo }: { topic: ITopic, actions: Actions, replyTo?: number}) => {

  const localState = {
    message: ""
  };

  const post = async (textarea: HTMLTextAreaElement) => {
    textarea.disabled = true;
    const param: IPostParam = {
      message: localState.message
    };
    if (replyTo) {
      param.replyTo = replyTo;
    }
    await typetalkApi.post(topic.id, param);
    textarea.disabled = false;
    textarea.value = "";
  };

  return (
    <div
      class="Input"
      oncreate={(elm: HTMLElement) => {elm.querySelector("textarea").focus(); }}>
      <textarea
        oninput={(e: KeyboardEvent) => {
          localState.message = (e.target as HTMLTextAreaElement).value;
        }}
        onkeydown={(e: KeyboardEvent) => {
          // valueに入力したテキストがちゃんと入ってくるために遅延させる
          setTimeout(async () => {
            if (e.keyCode === 13 && !e.shiftKey) { // Enterキー
              post(e.target as HTMLTextAreaElement);
            }
          }, 1);
        }}/>
      <button
        type="button"
        onclick={(e: Event) => {
          const textarea = (e.target as HTMLElement).parentElement.querySelector("textarea");
          post(textarea);
        }}>Post</button>
    </div>
  );
};
