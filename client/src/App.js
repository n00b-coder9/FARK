import React, { useEffect } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import Navigation from './components/Navigation';
import Auth from './components/auth';
import Snackbar from './components/common/Snackbar';

import { setIsSnackbarOpen } from './redux/slices/snackbar';
import { fetchIsDrawerOpen } from './redux/slices/drawer';

import './App.css';

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

  const snackbarState = useSelector((state) => state.snackbar);

  // Fetch the initial drawer open state
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
          {/* Auth related routes */}
          <Route path='/auth'>
            <Auth/>
          </Route>
        </Switch>
      </main>

      {/* App wide single snackbar */}
      <Snackbar
        open={snackbarState.isOpen}
        message={snackbarState.message}
        severity={snackbarState.severity}
        onClose={
          () => dispatch(setIsSnackbarOpen({ isOpen: false }))
        } />
    </div>
  );
}

export default withRouter(App);
