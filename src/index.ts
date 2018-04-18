import { app } from "hyperapp";
import Actions from "./Actions";
import { typetalkApi } from "./Api";
import routes from "./components/templates/Routes"
import { state } from "./State";
import { notification } from "./Notification";


const tokenStr = localStorage.getItem("auth_token");
if(tokenStr != null) {
  typetalkApi.setToken(JSON.parse(tokenStr));
}

const actions = app(state, new Actions(), routes, document.body);

if(tokenStr != null) {
    typetalkApi.initFetch(actions, notification)
}
