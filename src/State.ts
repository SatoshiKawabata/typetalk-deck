import { IMessageList, IReplies, ITopics, IProfile } from "./typetalk/Models";
import { IView } from "./models/view";

export interface IState {
  selfProfile: IProfile;
  topics: ITopics;
  messageLists: IMessageList[];
  replies: IReplies;
  view: IView;
}

/**
 * アプリケーション全体の状態
 * 一個のでっかいJSON
 */
export const state: IState = {
  selfProfile: null,
  messageLists: [],
  topics: null,
  replies: null,
  view: {
    tabName: "favorites",
    replyInput: null,
    columns: {},
    showThread: false,
  }
};
