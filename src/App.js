import "tailwindcss/dist/base.css";
import "styles/globalStyles.css";
import React from "react";

/* Inner Pages */
import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import Appp from "pages/m/Appp";
import IthirajPage from "pages/IthirajPage";
import ErrorMessage from "pages/m/Components/MailboxList/ErrorMessage";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import IthirajPagec from "pages/IthirajPagec";

export default function App() {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;


  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to={'/login'} />
        </Route>
        <Route exact path="/login">
          <LoginPage/>
        </Route>
        <Route exact path="/signup">
          <SignupPage/>
        </Route>
        <Route exact path="/appp">
          <Appp/>
        </Route>
        <Route exact path="/ithi">
          <IthirajPage/>
        </Route>
        <Route exact path="/ithic">
          <IthirajPagec/>
        </Route>
        <Route exact path="/ErrorMessage">
          <ErrorMessage/>
        </Route>
      </Switch>
    </Router>
  );
}