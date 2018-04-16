import { h } from "hyperapp";
import Actions from "../../Actions";
import { pstyle } from "../../polyfills/picostyle";
import { IView } from "../../State";
import { IMessageList } from "../../typetalk/Models";
import { isAddedToTop, node2Array } from "../../utils/utils";
import Input from "../molecules/Input";
import Post from "../molecules/Post";
import PostListMenu from "../molecules/PostListMenu";

const Title = pstyle("div")({
  "line-height": "32px"
});

const Scroll = pstyle("ul")({
  "height": "calc(100vh - 32px - 32px)",
  "overflow-x": "hidden",
  "overflow-y": "auto",
  "word-break": "break-word",
  "li": {
    "margin-bottom": "24px",
    "position": "relative"
  },
  "li:last-child": {
    "margin-bottom": "20px"
  },
  "div.reply-line": {
    "border-left": "3px solid",
    "bottom": "100%",
    "left": "19px",
    "position": "absolute",
    "height": "0"
  },
  "div.reply-line--unconnected": {
    "border-style": "dotted"
  },
  "div.reply": {
    position: "absolute"
  }
});

export default ({list, actions, view}: {list: IMessageList, actions: Actions, view: IView}) => {
  return [
    <Title>
      {list.topic.name}
    </Title>,
    <Scroll
      oncreate={(elm: HTMLElement) => {
        elm.scrollTop = Number.MAX_SAFE_INTEGER;
        const mo = new MutationObserver(mutations => {
          console.log("mutations", elm.scrollHeight);
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
              if (elm.children[0].classList.contains("reply-line")) {
                const parent = elm.parentElement;
                const replyTo = parent.children[i - 1] as HTMLElement;
                const height = elm.offsetTop - replyTo.offsetTop - 40;
                (elm.children[0] as HTMLElement).style.height = `${height}px`;
              } else if (elm.children[0].classList.contains("reply-line-unconnected")) {
                (elm.children[0] as HTMLElement).style.height = `${10}px`;
              }
            }}>
            {(() => {
              // draw reply line
              const prev = list.posts[i - 1];
              if (prev && post.replyTo === prev.id) {
                // draw line
                return <div class="reply-line"></div>;
              } else if (post.replyTo) {
                return <div class="reply-line-unconnected"></div>;
              }
            })()}
            <Post post={post} isObserve={i === 0} actions={actions} view={view} />
            {view.replyInput === post.id
              ? <Input actions={actions} topic={list.topic} replyTo={view.replyInput}/>
              : null}
          </li>
        ))
      }
    </Scroll>,
    <Input actions={actions} topic={list.topic} />
  ];
};
