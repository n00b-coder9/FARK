import React from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Button, makeStyles } from '@material-ui/core';
import Register from './Register';
import Login from './Login';

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
  const location = useLocation();
  // grab the 'from' part and pass it as a prop to the <Login>
  const { from: prevPath } = location.state || {
    from: '/dashboard',
  };

  return (
    <Switch>
      {/* Route to register page if `/auth/register` */}
      <Route exact path="/auth/register">
        <Register />
      </Route>
      {/* Route to login page if `/auth/login` */}
      <Route exact path="/auth/login">
        <Login />
      </Route>
      {/* Show login/register option if `/auth` */}
      <Route exact path="/auth">
        <div className={classes.root}>
          {/* Login button */}
          <Link
            to={{ pathname: '/auth/login', state: { from: prevPath } }}
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
            to={{ pathname: '/auth/register', state: { from: prevPath } }}
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
