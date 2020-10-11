import React, { useEffect } from 'react';
import { Route, withRouter, Switch, NavLink } from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import loginQuery from './graphQl/queries/loginQuery';
import signupQuery from './graphQl/queries/signupQuery';
import './App.css';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Navigation from './components/Navigation';
import { fetchIsDrawerOpen } from './redux/slices/drawer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loginHandler = (event, authdata) => {
    event.preventDefault();
    const graphqlQuery = loginQuery(authdata);
    fetch('http://localhost:8080/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphqlQuery),
        })
        .then((res) => {
          return res.json;
        },
        ).then((resData) => {
          if (resData.errors && resData.errors[0].status === 422) {
            throw new Error('Validation Failed ! Make Sure the email Address is correct');
          }
          if (resData.errors) {
            throw new Error('Validation Failed');
          }
        }).catch((err) => {
          // TODO: Handle error
        });
  };

  const signupHandler = (event, UserInputData) => {
    event.preventDefault();
    const graphqlQuery = signupQuery(UserInputData);
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    }).then(
        (res) => {
          return res.json;
        },
    ).then(
        (resData) => {
          if (resData.errors && resData.errors[0].status === 422) {
            throw new Error('Validation Failed ! Make sure the email isnt used yet .');
          }
          if (resData.errors) {
            throw new Error('User Creation failed');
          }
        },
    ).catch((err) => {
      // TODO: Handle error
    });
  };

  // Get the drawer open state
  useEffect(() => {
    dispatch(fetchIsDrawerOpen());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Navigation />

      <main
        className={classes.content}>
        <div className={classes.toolbar} />

        {/* App content starts here */}
        <header style={{ flexDirection: 'row', padding: 10, margin: 10 }}>
          <NavLink style={{ margin: 10 }} to='/'>Home</NavLink>
          <NavLink style={{ margin: 10 }} to='/signup'>SignUp</NavLink>
          <NavLink style={{ margin: 10 }} to='/login'>Login</NavLink>
        </header>
        <Switch>
          <Route exact path='/signup' component={() => <Signup onSignUp={signupHandler} />} />
          <Route exact path='/login' component={() => <Login onLogin={loginHandler} />} />
          <Route path='/' component={Feed} />
        </Switch>
      </main>
    </div>
  );
}

export default withRouter(App);
