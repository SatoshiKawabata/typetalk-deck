import { h } from "hyperapp";
import Actions from "../../Actions";
import "./PostListMenu.css";
import { ITopic } from "../../typetalk/Models";

export default ({ actions, topic }: { topic: ITopic, actions: Actions }) => {

  return (
    <div class="PostListMenu">
      <button
        class="PostListMenu--hide"
        type="button"
        onclick={(e: Event) => {
          const { classList } = (e.target as HTMLElement);
          if (classList.contains("PostListMenu--hide")) {
            classList.remove("PostListMenu--hide");
          } else {
            classList.add("PostListMenu--hide");
          }
        }}>...</button>
      <div class="PostListMenu__menu">
        <ul>
          <li>
            <button type="button" onclick={() => {
              actions.removeMessageList(topic.id);
            }}>Remove this topic</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
