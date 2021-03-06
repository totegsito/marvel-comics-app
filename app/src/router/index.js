/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';

import Login from '../pages/Login';
import LoginContainer from '../containers/Login';

import SignUp from '../pages/Register';
import SignUpContainer from '../containers/SignUp';

// import ComicsList from '../components/ComicList';
// import ComicsListContainer from '../containers/ComicList';

import Main from '../pages/MainPage';

import Notification from '../containers/Notification';

import NotFound from '../pages/NotFound';
import Loader from '../components/Loader';

// eslint-disable-next-line react/prefer-stateless-function
class Routes extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.onLogoutSubmit();
  }

  render() {
    const {
      user,
      error,
      loading,
      success,
    } = this.props;
    return (
      <BrowserRouter>
        <div>
          <nav className="navbar is-primary is-fixed-top">
            <div className="navbar-brand">
              <NavLink className="navbar-item" to="/">Home</NavLink>
            </div>
            <div className="navbar-menu">
              <div className="navbar-end" position="end">
                {
                  ((!user || !user.isLoggedIn) &&
                  [
                    <NavLink key="login" to="login" className="navbar-item">Login</NavLink>,
                    <NavLink
                      key="register"
                      to="register"
                      className="navbar-item"
                    >
                      Register
                    </NavLink>,
                  ]) ||
                  [
                    <p className="navbar-item">{user.username}</p>,
                    <a
                      tabIndex="0"
                      role="button"
                      className="navbar-item"
                      onClick={this.handleLogout}
                      onKeyPress={this.handleLogout}
                    >
                      Logout
                    </a>,
                  ]
                }
              </div>
            </div>
          </nav>
          <main className={`container main-container ${loading ? 'no-scroll' : ''}`}>
            <Loader loading={loading} />
            {
              (error &&
              <Notification message={error} />)
              || (success &&
                <Notification message={success} type="success" />
              )
            }
            <Switch>
              <Route
                exact
                path="/"
                render={() =>
                  (user.isLoggedIn ?
                    <Main /> :
                    <Home />)
                }
              />
              <Route
                path="/login"
                render={props => (
                  user.isLoggedIn ?
                    <Redirect to="/" /> :
                    <LoginContainer {...props} Layout={Login} />
                )}
              />
              <Route
                path="/register"
                render={props => (
                  success ?
                    <Redirect to="/login" /> :
                    <SignUpContainer {...props} Layout={SignUp} />
                )}
              />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

Routes.propTypes = {
  error: PropTypes.string,
  success: PropTypes.string,
  loading: PropTypes.bool,
  user: PropTypes.shape({}).isRequired,
  onLogoutSubmit: PropTypes.func.isRequired,
};

Routes.defaultProps = {
  error: null,
  success: null,
  loading: false,
};


export default Routes;
