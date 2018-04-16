import { h } from "hyperapp";
import Actions from "../../Actions";
import { IState } from "../../State";
import PostList from "../organisms/PostList";
import TopicList from "../organisms/TopicList";
import "./Container.css";

export default (state: IState, actions: Actions) => {
  console.log(state);
  return (
    <div class="Container">
      <div class="Container__topic-list">
        <TopicList state={state} actions={actions} />
      </div>
      {
        state.messageLists.map(list => {
          return (
            <div class="Container__post-list" key={list.topic.id}>
              <PostList list={list} actions={actions} view={state.view} />
            </div>
          );
        })
      }
    </div>
  );
};
