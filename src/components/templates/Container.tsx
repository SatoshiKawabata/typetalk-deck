import { h } from "hyperapp";
import Actions from "../../Actions";
import { IState } from "../../State";
import PostList from "../organisms/PostList";
import TopicList from "../organisms/TopicList";
import "./Container.css";

export default (state: IState, actions: Actions) => {
  console.log("state", state);
  return (
    <div class="Container">
      <div class="Container__topic-list">
        <TopicList state={state} actions={actions} />
      </div>
      {
        state.messageLists.map(list => {
          const column = state.view.columns[list.topic.id];
          return (
            <div
              class="Container__post-list"
              key={list.topic.id}
              style={`flex-basis: ${column.width}px`}>
              <PostList list={list} state={state} actions={actions} view={state.view} />
            </div>
          );
        })
      }
    </div>
  );
};
