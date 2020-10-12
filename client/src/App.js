import React, { useEffect } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import './App.css';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Navigation from './components/Navigation';
import { fetchIsDrawerOpen } from './redux/slices/drawer';
import Auth from './components/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1 0 auto',
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

  // Get the drawer open state
  useEffect(() => {
    dispatch(fetchIsDrawerOpen());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Navigation />

      <div className={classes.toolbar} />
      <main
        className={classes.content}>

        {/* App content starts here */}
        <Switch>
          <Route path='/auth'>
            <Auth/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default withRouter(App);
