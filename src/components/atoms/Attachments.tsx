import { h } from "hyperapp";
import Actions from "../../Actions";
import { IState } from "../../State";
import { IPost } from "../../typetalk/Models";
import "./Attachments.css";
import { typetalkApi } from "../../Api";

export default ({state, post, actions}: {state: IState, post: IPost, actions: Actions}) => {
  console.log(state);
  return (
    <div
      class="Attachments"
      oncreate={() => {
        post.attachments.forEach(async attachment => {
          const rawData = await typetalkApi.downloadAttachment(attachment);
          actions.addAttachment({
            url: attachment.apiUrl,
            uri: URL.createObjectURL(rawData)
          });
        });
      }}>
      {
        post.attachments.map(attachment => {
          if (state.attachmentMap[attachment.apiUrl]) {
            if (attachment.attachment.contentType.indexOf("image") > -1) {
              return (
                <a download={attachment.attachment.fileName} href={state.attachmentMap[attachment.apiUrl]}>
                  <img class="Attachments__img" src={state.attachmentMap[attachment.apiUrl]} />
                </a>);
            } else {
              return <a download={attachment.attachment.fileName} href={state.attachmentMap[attachment.apiUrl]}>{attachment.attachment.fileName}</a>
            }
          } else {
            return null;
          }
        })
      }
    </div>
  );
};
