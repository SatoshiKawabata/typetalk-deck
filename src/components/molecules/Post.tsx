import { h } from "hyperapp";
import showdown from "showdown";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { IState } from "../../State";
import { IPost } from "../../typetalk/Models";
import "./Post.css";
import LikeToggle from "../atoms/LikeToggle";
import { IView } from "../../models/view";

const converter = new showdown.Converter();
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

export default ({state, post, isObserve, actions, view}: {state: IState, post: IPost, isObserve: boolean, actions: Actions, view: IView}) => {
  const oncreate = isObserve ?
    (elm: HTMLElement) => {
      const io = new IntersectionObserver(async entries => {
          if (entries[0].isIntersecting) {
            io.disconnect();
            const messageList = await typetalkApi.getMessageList(post.topicId, post.id);
            actions.messageList(messageList);
          }
        });
      io.observe(elm);
    }
    : null;

  let newMessage = post.message;
  // Applying markdown only for code and blockquote
  if (newMessage.indexOf("```") !== -1 || newMessage.indexOf(">") !== -1) {
      newMessage = converter.makeHtml(newMessage);
  }

  // Apply link to HTTP text when markdown is not applied
  if (newMessage === post.message) {
      newMessage = post.message.replace(urlRegex, (url: string) => {
          return `<a href=${url} target="_blank">${url}</a>`;
      });
  }

  return (
    <div class="Post" oncreate={oncreate}>
      <div class="Post__thumbnail-container">
        <img src={post.account.imageUrl} alt={post.account.fullName} />
      </div>
      <button
        type="button"
        class="Post__post-container"
        onclick={() => {
          if (view.replyInput === post.id) {
            actions.replyInput(null);
            actions.toggleShowThread(null);
          } else {
            actions.replyInput(post.id);
            actions.toggleShowThread(post.id);
          }
        }}>
        <p>{post.account.fullName}</p>
        <p class="Post__post-message" innerHTML={newMessage}></p>
      </button>
      <LikeToggle state={state} actions={actions} post={post} />
    </div>
  );
};
