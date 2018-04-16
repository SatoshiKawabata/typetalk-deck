import { h } from "hyperapp";
import Post from "./Post";

describe("test", () => {
  it("a", () => {
    const view = state => (
      <Post post={null} isObserve={false} actions={{} as any} />
    );
    console.log(view);
    expect(h("Post")).toEqual({
      nodeName: "Post",
      attributes: {},
      children: []
    });
  });
});
