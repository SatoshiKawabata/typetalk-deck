import { h } from "hyperapp";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { pstyle } from "../../polyfills/picostyle";
import { IView } from "../../State";
import { IPost } from "../../typetalk/Models";

const Wrapper = pstyle("div")({
  "display": "flex",
  "div.thumbnail-container": {
    width: "40px",
    height: "40px",
    img: {
      width: "40px",
      height: "40px"
    }
  },

  "p": {
    "font-size": "14px",
  },

  "p.post-message": {
    "line-height": "16px"
  },

  "button.post-container": {
    "padding": 0,
    "background": "#fff",
    "border": "none",
    "text-align": "left"
  }

});

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
    <Wrapper oncreate={oncreate}>
      <div class="thumbnail-container">
        <img src={post.account.imageUrl} alt={post.account.fullName} />
      </div>
      <button
        type="button"
        class="post-container"
        onclick={() => {
          console.log("onclick", post);
          if (view.replyInput === post.id) {
            actions.replyInput(null);
          } else {
            actions.replyInput(post.id);
          }
        }}>
        <p>{post.account.fullName}</p>
        <p class="post-message">{post.message}</p>
      </button>
    </Wrapper>
  );
};
