import { h } from "hyperapp";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { IView } from "../../State";
import { IPost } from "../../typetalk/Models";
import "./Post.css";

export default ({post, isObserve, actions, view}: {post: IPost, isObserve: boolean, actions: Actions, view: IView}) => {
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
          console.log("onclick", post);
          if (view.replyInput === post.id) {
            actions.replyInput(null);
          } else {
            actions.replyInput(post.id);
          }
        }}>
        <p>{post.account.fullName}</p>
        <p class="Post__post-message">{post.message}</p>
      </button>
    </div>
  );
};
