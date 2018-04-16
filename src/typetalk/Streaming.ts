import * as electron from "electron";
import { IPost, ISpace, ITalk, ITopic } from "./Models";

export default class Streaming {
  start(callback: (msg: IStreaming) => void) {
    electron.ipcRenderer.on("streaming-message", (event, message) => {
      callback(JSON.parse(message));
    });
  }
}

export const StreamingEvent = {
  ADD_TALK_POST: "addTalkPost",
  CREATE_TALK: "createTalk",
  DELATE_ATTACHMENT: "deleteAttachment",
  DELETE_MESSAGE: "deleteMessage",
  LIKE_MESSAGE: "likeMessage",
  NOTIFY_MENTION: "notifyMention",
  POST_LINK: "postLinks",
  POST_MESSAGE: "postMessage",
  READ_MENTION: "readMention",
  SAVE_BOOKMARK: "saveBookmark",
  SAVE_LIKES_BOOKMARK: "saveLikesBookmark",
  UNLIKE_MESSAGE: "unlikeMessage",
  UPDATE_MESSAGE: "updateMessage",
  UPDATE_NOTIFICATION_ACCESS: "updateNotificationAccess",
  UPDATE_SPACE: "updateSpace",
  UPDATE_TALK: "updateTalk",
  UPDATE_TOPIC: "updateTopic",
};

export type StreamingEvent =
  "addTalkPost" |
  "createTalk" |
  "deleteAttachment" |
  "deleteMessage" |
  "likeMessage" |
  "notifyMention" |
  "postLinks" |
  "postMessage" |
  "readMention" |
  "saveBookmark" |
  "saveLikesBookmark" |
  "unlikeMessage" |
  "updateMessage" |
  "updateNotificationAccess" |
  "updateSpace" |
  "updateTalk" |
  "updateTopic";

export interface IStreaming {
  type: StreamingEvent;
  data: any;
}

export interface IpostMessage {
  "type": "postMessage";
  "data": {
    "space": ISpace;
    "topic": ITopic;
    "post": IPost;
    "mentions": any[];
    "exceedsAttachmentLimit": boolean;
    "directMessage": any;
  };
}

export interface IaddTalkPost extends IStreaming {
  type: "addTalkPost";
  data: {
    topic: ITopic;
    talk: ITalk;
  };
}

export interface IcreateTalk extends IStreaming {
  type: "createTalk";
  data: {
    topic: ITopic;
    talk: ITalk;
    postIds: number[];
  };
}

export interface IdeleteAttachment extends IStreaming {
  type: "deleteAttachment";
  data: {
    topic: ITopic;
    post: IPost;
    exceedsAttachmentLimit: boolean;
  };
}

export interface IdeleteMessage extends IStreaming {
  type: "deleteMessage";
  data: {
    space: ISpace;
    topic: ITopic;
    post: IPost;
    exceedsAttachmentLimit: boolean;
  };
}
