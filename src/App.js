import React, { useEffect, lazy, Suspense, useState } from "react";

//react-router-dom
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

//react-redux
import { useDispatch, useSelector } from "react-redux";

// css
import "./Component/assets/css/bootstrap.min.css";
import "./Component/assets/css/typography-dark.css";
import "./Component/assets/css/style.css";
import "./Component/assets/css/responsive.css";
import "./Component/assets/js/chartist/chartist.min.css";
import "./Component/assets/css/variable.css";
import "./Component/assets/css/ionicons.min.css";
import "./Component/assets/css/line-awesome.min.css";
import "./Component/assets/css/fontawesome.css";
import "./Component/assets/css/remixicon.css";

//js
import "./Component/assets/js/custom.js";
import "./Component/assets/js/jquery.min.js";
import "./Component/assets/js/rtl.js";
import "./Component/assets/js/customizer.js";
import "./Component/assets/js/popper.min.js";
import "./Component/assets/js/bootstrap.min.js";
import "./Component/assets/js/jquery.appear.js";
import "./Component/assets/js/countdown.min.js";
import "./Component/assets/js/waypoints.min.js";
import "./Component/assets/js/jquery.counterup.min.js";
import "./Component/assets/js/wow.min.js";
import "./Component/assets/js/apexcharts.js";
import "./Component/assets/js/slick.min.js";
import "./Component/assets/js/select2.min.js";
import "./Component/assets/js/jquery.magnific-popup.min.js";
import "./Component/assets/js/smooth-scrollbar.js";
import "./Component/assets/js/lottie.js";
import "./Component/assets/js/core.js";
import "./Component/assets/js/charts.js";
import "./Component/assets/js/animated.js";
import "./Component/assets/js/kelly.js";
import "./Component/assets/js/morris.js";
import "./Component/assets/js/maps.js";
import "./Component/assets/js/worldLow.js";
import "./Component/assets/js/chartist/chartist.min.js";
import "./Component/assets/js/chart-custom.js";

//Types
import { SET_ADMIN, UNSET_ADMIN } from "./store/Admin/admin.type";

import { IdleTimeoutManager } from "idle-timer-manager";
import Registration from "./Pages/Registration";
import UpdateCode from "./Pages/UpdateCode";
import axios from "axios";
import Loader from "../src/Pages/Loader";

//component

const Login = lazy(() => import("./Pages/Login"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ChangePassword = lazy(() => import("./Pages/ChangePassword"));
const Admin = lazy(() => import("./Pages/Admin"));
const AuthRouter = lazy(() => import("./util/AuthRoute"));

function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.admin);
  const token = localStorage.getItem("token");
  const key = localStorage.getItem("key");
  const [login, setLogin] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        if (res.data.status) {
          setLogin(res.data.login);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const manager = new IdleTimeoutManager({
      timeout: 600, //10 min (in sec)
      onExpired: (time) => {
        dispatch({ type: UNSET_ADMIN });
        history.push("/login");
      },
    });

    return () => {
      manager.clear();
    }; //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: SET_ADMIN, payload: token });
  }, [token, key]);

  return (
    <>
      <div className="wrapper">
        <Suspense fallback={<div></div>}>
          <Switch>
            <AuthRouter
              exact
              path="/"
              component={login ? Login : Registration}
            />

            {login && (
              <AuthRouter path="/Registration" component={Registration} />
            )}
            {login && <AuthRouter exact path="/code" component={UpdateCode} />}
            {login && <AuthRouter exact path="/code" component={UpdateCode} />}
            {login && <AuthRouter exact path="/login" component={Login} />}
            
            <AuthRouter
              exact
              path="/forgotPassword"
              component={ForgotPassword}
            />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/changePassword/:id" component={ChangePassword} />
            {isAuth && <Route path="/admin" component={Admin} />}
          </Switch>
          <Loader />
        </Suspense>
      </div>
    </>
  );
}

export default App;
