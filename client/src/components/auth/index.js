import React from 'react';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Backdrop, Button, CircularProgress, makeStyles } from '@material-ui/core';
import Register from './Register';
import Login from './Login';
import { useSelector } from 'react-redux';
import Logout from './Logout';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  authButton: {
    padding: '16px',
    width: '250px',
  },
}));

function Auth() {
  const classes = useStyles();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();
  // grab the 'from' part and pass it as a prop to the <Login>
  const { from: prevPath } = location.state || {
    from: '/dashboard',
  };

  // Login state hasn't been fetched yet
  if (isLoggedIn === null) {
    return <Backdrop open={true} ><CircularProgress/></Backdrop>;
  };

  return (
    <Switch>
      {isLoggedIn &&
        <Route exact path="/auth/logout">
          <Logout />
        </Route>
      }

      {/* If user is logged in, redirect to dashboard and forbid any other functionality */}
      {isLoggedIn && <Redirect to="/dashboard" />}

      <Route exact path="/auth/register">
        <Register />
      </Route>

      <Route exact path="/auth/login">
        <Login />
      </Route>

      {/* Show login/register option if `/auth` */}
      <Route exact path="/auth">
        <div className={classes.root}>
          {/* Login button */}
          <Link
            to={{ pathname: '/auth/login', state: { ...location.state, from: prevPath } }}
          >
            <Button
              className={classes.authButton}
              variant="contained"
              style={{ backgroundColor: '#2196F3' }}
              startIcon={<LockOpenIcon />}
            >
                Login
            </Button>
          </Link>

          {/* Register button */}
          <Link
            to={{ pathname: '/auth/register', state: { ...location.state, from: prevPath } }}
          >
            <Button
              className={classes.authButton}
              variant="contained"
              style={{ backgroundColor: '#26A69A', marginTop: '24px' }}
              startIcon={<CreateIcon />}
            >
                Register
            </Button>
          </Link>
        </div>
      </Route>
    </Switch>
  );
}

export default Auth;
