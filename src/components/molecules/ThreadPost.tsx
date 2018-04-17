import { h } from "hyperapp";
import Actions from "../../Actions";
import { IState } from "../../State";
import "./ThreadPost.css";
import { IView } from "../../models/view";
import { IPost } from "../../typetalk/Models";
import Post from "./Post";

export default ({state, listPost, post, isObserve, actions, view}: {state: IState, listPost: IPost[], post: IPost, isObserve: boolean, actions: Actions, view: IView}) => {
    const threadPostList: IPost[] = [];
    let currentReplyTo: number = post.replyTo;
    while (currentReplyTo) {
        for (const p of listPost) {
            if (p.id === currentReplyTo) {
                threadPostList.unshift(p);
                currentReplyTo = p.replyTo;
                break;
            }
        }
    }
    return (
        <div class="ThreadPost">
            {
                threadPostList.map((thread, i) => (
                    <div class="ThreadPost__container">
                        <Post state={state} post={thread} isObserve={isObserve} actions={actions} view={view} />
                        {((p) => {
                            // draw reply line
                            if (p.replyTo) {
                                return <div className="PostList__reply-line"></div>;
                            }
                        })(thread)}

                    </div>
                ))
            }
        </div>
    );
};
