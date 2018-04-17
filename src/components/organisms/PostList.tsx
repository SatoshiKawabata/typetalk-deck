import { h } from "hyperapp";
import Actions from "../../Actions";
import { IState } from "../../State";
import { IMessageList } from "../../typetalk/Models";
import { isAddedToTop, node2Array } from "../../utils/utils";
import Input from "../molecules/Input";
import Post from "../molecules/Post";
import "./PostList.css";
import PostListMenu from "../molecules/PostListMenu";
import { IView } from "../../models/view";
import ThreadPost from "../molecules/ThreadPost";

export default ({state, list, actions, view}: {state: IState, list: IMessageList, actions: Actions, view: IView}) => {
  return [
    <div class="PostList__title">
      <span class="PostList__topic-name">{list.topic.name}</span>
      <PostListMenu actions={actions} topic={list.topic} />
    </div>,
    <ul
      class="PostList__scroll"
      oncreate={(elm: HTMLElement) => {
        elm.scrollTop = Number.MAX_SAFE_INTEGER;
        const mo = new MutationObserver(mutations => {
          let addedHeight = 0;
          const isTop = isAddedToTop(mutations.map(m => m.addedNodes[0]), elm.childNodes);
          if (isTop) {
            mutations.forEach(m => {
              if (m.addedNodes.length) {
                node2Array(m.addedNodes).forEach(node => {
                  addedHeight += (node as HTMLElement).offsetHeight;
                });
              }
            });
            elm.scrollTop += addedHeight;
          }
        });
        mo.observe(elm, {
          childList: true
        });
      }}
      >
      {
        list.posts.map((post, i) => (
          <li
            key={post.id}
            oncreate={(elm: HTMLElement) => {
              // draw reply line
              if (elm.children[0].classList.contains("PostList__reply-line--unconnected")) {
                (elm.children[0] as HTMLElement).style.height = `${10}px`;
              } else if (elm.children[0].classList.contains("PostList__reply-line")) {
                const parent = elm.parentElement;
                const replyTo = parent.children[i - 1] as HTMLElement;
                const height = elm.offsetTop - replyTo.offsetTop - 40;
                (elm.children[0] as HTMLElement).style.height = `${height}px`;
              }
            }}>
            {(() => {
              // draw reply line
              const prev = list.posts[i - 1];
              if (prev && post.replyTo === prev.id) {
                // draw line
                return <div class="PostList__reply-line"></div>;
              } else if (post.replyTo) {
                return <div class="PostList__reply-line PostList__reply-line--unconnected"></div>;
              }
            })()}
            {view.showThread === post.id ? <ThreadPost state={state} listPost={list.posts} post={post} isObserve={i === 0} actions={actions} view={view}/> : null}
            <Post state={state} post={post} isObserve={i === 0} actions={actions} view={view} />
            {view.replyInput === post.id
              ? <Input actions={actions} topic={list.topic} replyTo={view.replyInput}/>
              : null}
          </li>
        ))
      }
    </ul>,
    <Input actions={actions} topic={list.topic} />
  ];
};
