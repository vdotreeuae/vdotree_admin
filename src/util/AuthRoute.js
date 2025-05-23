import React from "react";

//Routing
import { Redirect, Route } from "react-router-dom";

//redux
import { connect } from "react-redux";


const AuthRouter = ({ component: Component, isAuth, ...rest }) => (

  <Route
    {...rest}
    render={(props) =>
      isAuth === true ? <Redirect to="/admin" /> : <Component {...props} />
    }
  />
);

const mapStateToProps = (state) => ({
  isAuth: state.admin.isAuth,
});

export default connect(mapStateToProps)(AuthRouter);
