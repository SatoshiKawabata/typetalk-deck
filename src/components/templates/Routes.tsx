import { Route, Redirect } from "@hyperapp/router"
import { h } from "hyperapp";
import Login from "./Login";
import { IState } from "../../State";
import Actions from "../../Actions";
import Container from "./Container";

export default (state: IState, actions: Actions) => {
    const tokenStr = localStorage.getItem("auth_token");

    if(state.login || tokenStr != null) {
        return (<Container state={state} actions={actions} />)
    }

    return <Route render={() => Login(state, actions) }  />
}
