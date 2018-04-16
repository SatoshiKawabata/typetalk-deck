import { h } from "hyperapp";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { IState } from "../../State";
import "./TopicList.css";

export default ({state, actions}: {state: IState, actions: Actions}) => {

  const visibleTopics = (() => {
    if (state.topics && state.view.tabName === "all") {
      return state.topics.topics.filter((topic) => !topic.favorite);
    } else if (state.topics && state.view.tabName === "favorites") {
      return state.topics.topics.filter((topic) => topic.favorite);
    } else {
      return [];
    }
  })();

  return [
    <ul>
      <li>
        <button
          class={
            state.view.tabName === "all"
            ? "TopicList__tablist--selected" : null
          }
          type="button"
          onclick={() => { actions.tabName("all"); }}>All</button>
      </li>
      <li>
        <button
          class={
            state.view.tabName === "favorites"
            ? "TopicList__tablist--selected" : null
          }
          type="button"
          onclick={() => { actions.tabName("favorites"); }}>Favorites</button>
      </li>
    </ul>,
    <ul class="TopicList__list">
      {
        visibleTopics.map((topic) => (
          <li>
            <button
              type="button"
              onclick={async () => {
                const messageList = await typetalkApi.getMessageList(topic.topic.id);
                actions.unshiftMessageList(messageList);
              }}>
              {topic.topic.name}
            </button>
            <span>{topic.unread.count}</span>
          </li>
        ))
      }
    </ul>
  ];
};
