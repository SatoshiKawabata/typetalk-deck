import { IState, TabName } from "./State";
import { IMessageList, IPost, ITopics } from "./typetalk/Models";

/**
 * APIの呼び出しはコンポーネント側で行い、ActionsではStateへの変更するだけに留めるのがいいのではないかと思っている
 */
export default class Actions {

  private static getMessageListIndex(topicId: number, state: IState) {
    let index = -1;
    state.messageLists.find((list, i) => {
      if (list.topic.id === topicId) {
        index = i;
        return true;
      }
    });
    return index;
  }

  topics = (topics: ITopics) => (state: IState, actions: Actions) => {
    return {
      topics
    };
  }

  tabName = (tabName: TabName) => (state: IState, actions: Actions) => {
    state.view.tabName = tabName;
    return {
      view: state.view
    };
  }

  replyInput = (replyTo: number) => (state: IState, actions: Actions) => {
    state.view.replyInput = replyTo;
    return {
      view: state.view
    };
  }

  unshiftMessageList = (messageList: IMessageList) => (state: IState, actions: Actions) => {
    let idx;
    const list = state.messageLists.find((l, i) => {
      if (l.topic.id === messageList.topic.id) {
        idx = i;
        return true;
      }
    });
    if (list) {
      state.messageLists.splice(idx, 1);
      state.messageLists.unshift(list);
      return {
        messageLists: state.messageLists
      };
    } else {
      return {
        messageLists: [messageList, ...state.messageLists]
      };
    }
  }

  messageList = (messageList: IMessageList) => (state: IState, actions: Actions) => {
    const index = Actions.getMessageListIndex(messageList.topic.id, state);
    if (state.messageLists[index]) {
      // postsのマージ
      const oldPosts = state.messageLists[index].posts;
      const newPosts = messageList.posts;
      const willAdd = [];
      oldPosts.forEach(oldPost => {
        if (newPosts.find(post => post.id === oldPost.id) === undefined) {
          willAdd.push(oldPost);
        }
      });
      newPosts.unshift(...willAdd);
      newPosts.sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        if (aDate > bDate) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    state.messageLists[index] = messageList;
    return { messageLists: state.messageLists };
  }

  post = (post: IPost) => (state: IState, actions: Actions) => {
    const messageList = state.messageLists.find(ml => ml.topic.id === post.topicId);
    if (messageList) {
      messageList.posts.push(post);
      actions.messageList(messageList);
    }
  }
}
