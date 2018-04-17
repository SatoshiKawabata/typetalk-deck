import { IMessageList } from "../typetalk/Models";

export type TabName = "all" | "favorites";

/**
 * 各列の見た目の状態
 */
export interface IColumn {
  width: number;
}

export const defaultColumn = (): IColumn => {
  return {
    width: 400
  };
}

export interface IView {
  tabName: TabName;
  replyInput: number; // to show reply input UI
  columns: { [key: number]: IColumn}; // key: topicId
  draggingMessageList: IMessageList;
}
