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
              draggable={true}
              ondragstart={(e: Event) => {
                actions.dragstart(list);
              }}
              ondrop={(e: Event) => {
                actions.drop(list);
              }}
              ondragend={(e: Event) => {
                actions.dragend();
              }}
              ondragenter={(e: Event) => { e.preventDefault(); }}
              ondragover={(e: Event) => { e.preventDefault(); }}
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
