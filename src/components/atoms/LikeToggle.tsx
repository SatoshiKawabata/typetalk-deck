import { h } from "hyperapp";
import Actions from "../../Actions";
import { IPost, IAccount, IProfile } from "../../typetalk/Models";
import { typetalkApi } from "../../Api";
import "./LikeToggle.css";
import { IState } from "../../State";
import { getPost } from "../../utils/utils";

export default ({state, post, actions}: {state: IState, post: IPost, actions: Actions}) => {
  const isLikedByMe = isProfileIncludes(post.likes, state.selfProfile);
  return (
    <div class="LikeToggle">
      <button type="button" onclick={async () => {
        if (isLikedByMe) {
          const res = await typetalkApi.unlike(post.topicId, post.id);
          const resultPost = getPost(state, res.like.topicId, res.like.postId);
          setLike(resultPost, res.like, false);
          actions.updatePost(resultPost);
        } else {
          const res = await typetalkApi.like(post.topicId, post.id);
          const resultPost = getPost(state, res.like.topicId, res.like.postId);
          setLike(resultPost, res.like, true);
          actions.updatePost(resultPost);
        }
      }}>
        {isLikedByMe ? "♥" : "♡"} {post.likes.length}
      </button>
    </div>
  );
};

const isProfileIncludes = (profiles: IProfile[], profile: IProfile) => {
  return profiles.some(p => {
    return isMe(p.account, profile.account);
  })
}

const isMe = (accountA: IAccount, accountB: IAccount) => {
  return accountA.id === accountB.id;
}

const setLike = (post: IPost, profile: IProfile, isLike: boolean) => {
  if (isLike) {
    post.likes.push(profile);
  } else {
    post.likes.some((like, i) => {
      if (isMe(like.account, profile.account)) {
        post.likes.splice(i, 1);
        return true;
      }
    });
  }

}
