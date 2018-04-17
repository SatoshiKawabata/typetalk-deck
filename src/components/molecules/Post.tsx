import { h } from "hyperapp";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { IState } from "../../State";
import { IPost } from "../../typetalk/Models";
import "./Post.css";
import LikeToggle from "../atoms/LikeToggle";
import { IView } from "../../models/view";

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
          } else {
            actions.replyInput(post.id);
          }
        }}>
        <p>{post.account.fullName}</p>
        <p class="Post__post-message">{post.message}</p>
      </button>
      <LikeToggle state={state} actions={actions} post={post} />
    </div>
  );
};
