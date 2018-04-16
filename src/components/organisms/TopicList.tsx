import { h } from "hyperapp";
import Actions from "../../Actions";
import { typetalkApi } from "../../Api";
import { pstyle } from "../../polyfills/picostyle";
import { IState } from "../../State";
import { classNames } from "../../utils/utils";

const Tablist = pstyle("ul")({
  "li.selected": {
    button: {
      color: "#ffa695"
    }
  }
});

const Scroll = pstyle("ul")({
  "li:last-child": {
    "margin-bottom": "20px"
  }
});

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
    <Tablist>
      <li class={classNames([
        state.view.tabName === "all" ? "selected" : null
      ])}>
        <button type="button" onclick={() => { actions.tabName("all"); }}>All</button>
      </li>
      <li class={classNames([
        state.view.tabName === "favorites" ? "selected" : null
      ])}>
        <button type="button" onclick={() => { actions.tabName("favorites"); }}>Favorites</button>
      </li>
    </Tablist>,
    <Scroll>
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
    </Scroll>
  ];
};
