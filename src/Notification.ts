
const title = "Typetalk Notification"

export const notification = body => {
    new Notification(title, {body});
}