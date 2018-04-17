import { IMessageList, IReplies, ITopics, IProfile } from "./typetalk/Models";
import { IView } from "./models/view";
import { location } from "@hyperapp/router"

export interface IState {
  selfProfile: IProfile;
  topics: ITopics;
  messageLists: IMessageList[];
  replies: IReplies;
  view: IView;
  location: any;
  login: boolean;
  attachmentMap: { [key: string]: any}; // attachment data uri(key: attachment.apiUrl)
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
  location: location.state,
  login: false,
  view: {
    tabName: "favorites",
    replyInput: null,
    columns: {},
    showThread: null,
    draggingMessageList: null
  },
  attachmentMap: {}
};
