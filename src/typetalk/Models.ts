import { IAccount } from "./Models";
export interface IAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface IProfile {
  account: IAccount;
}

export interface ITopic {
  id: number;
  name: string;
  description: string;
  suggestion: string;
  isDirectMessage: boolean;
  lastPostedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITopics {
  topics: Array<{
    topic: ITopic;
    favorite: boolean;
    unread: {
      topicId: number;
      postId: number;
      count: number
    }
  }>;
}

export interface IMessageList {
  mySpace: {
    space: {
      key: string;
      name: string;
      enabled: boolean;
      imageUrl: string;
    };
    myRole: string;
    isPaymentAdmin: boolean;
    myPlan: {
      plan: {
        key: string;
        name: string;
        limitNumberOfUsers: number;
        limitTotalAttachmentSize: number;
      };
      enabled: boolean;
      trial: any;
      numberOfUsers: number;
      totalAttachmentSize: number;
      createdAt: string;
      updatedAt: string;
    }
  };
  team: any;
  topic: ITopic;
  bookmark: {
    postId: number;
    updatedAt: string
  };
  posts: IPost[];
  hasNext: boolean;
  exceedsAttachmentLimit: boolean;
}

export interface IAccount {
  id: number;
  name: string;
  fullName: string;
  suggestion: string;
  imageUrl: string;
  isBot: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IAttachment {
  attachment: {
    contentType: string;
    fileKey: string;
    fileName: string;
    fileSize: number
  };
  webUrl: string;
  apiUrl: string;
  thumbnails: Array<{
    type: string;
    fileSize: number;
    width: number;
    height: number;
  }>;
}

export interface IPostParam {
  message: string;
  replyTo?: number;
  showLinkMeta?: boolean;
  fileKeys?: string[];
  talkIds?: string[];
}

export interface IPost {
  id: number;
  topicId: number;
  replyTo: number;
  message: string;
  account: IAccount;
  mention: string;
  attachments: IAttachment[];
  likes: IProfile[];
  talks: string[];
  links: Array<{
    id: number;
    url: string;
    contentType: string;
    title: string;
    description: string;
    imageUrl: string;
    embed: any;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface IReplies {
  replies: IPost[];
}

export interface ITalk {
  id: number;
  topicId: number;
  name: string;
  suggestion: string;
  createdAt: string;
  updatedAt: string;
  backlog: any;
}

export interface ISpace {
  key: string;
  name: string;
  enabled: boolean;
  imageUrl: string;
}

export interface ILike {
  like: {
    id: number;
    postId: number;
    topicId: number;
    comment: string;
    account: IAccount;
    createdAt: string;
  }
}
