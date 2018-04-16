import { h } from "hyperapp";
import Actions from "../../Actions";
import { pstyle } from "../../polyfills/picostyle";
import { IState } from "../../State";
import PostList from "../organisms/PostList";
import TopicList from "../organisms/TopicList";

const Wrapper = pstyle("div")({
  "display": "flex",
  "height": "100vh",
  "overflow-x": "auto",
  "overflow-y": "hidden",
  "font-family": '"Open Sans",Hiragino Sans,Meiryo,Helvetica,Arial,sans-serif',
  "div.topic-list": {
    "height": "100vh",
    "flex-basis": "300px",
    "flex-shrink": 0,
    "overflow-y": "auto",
    "overflow-x": "hidden"
  },
  "div.post-list": {
    "flex-basis": "400px",
    "flex-shrink": 0
  }
});

export default (state: IState, actions: Actions) => {

  console.log(state);
  return (
    <Wrapper>
      <style>
        {`
          body {
            padding: 0;
            margin: 0;
          }

          ul, p {
            padding: 0;
            margin: 0;
          }

          li {
            list-style: none;
          }
        `}
      </style>
      <div class="topic-list">
        <TopicList state={state} actions={actions} />
      </div>
      {
        state.messageLists.map(list => {
          return (
            <div class="post-list" key={list.topic.id}>
              <PostList list={list} actions={actions} view={state.view} />
            </div>
          );
        })
      }
    </Wrapper>
  );
};
