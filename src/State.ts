import { IMessageList, IReplies, ITopics } from "./typetalk/Models";

export type TabName = "all" | "favorites";

export interface IView {
  tabName: TabName;
  replyInput: number; // postId
}

export interface IState {
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
  messageLists: [],
  topics: null,
  replies: null,
  view: {
    tabName: "favorites",
    replyInput: null
  }
};
