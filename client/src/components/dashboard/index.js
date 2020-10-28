import React from 'react';
import {
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import RecentUrlContainer from './RecentUrlcontainer';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '80%',
    padding: '20px',
  },
  toproot: {
    display: 'flex',
    flexDirection: 'row',
    height: '40%',
    justifyContent: 'space-between',
  },
  bottomroot: {
    display: 'flex',
    flexDirection: 'row',
    height: '60%',
    justifyContent: 'space-between',
  },
  recentUrlcontainer: {
    width: '30%',
    textAlign: 'center',
  },
  leftview: {
    width: '30%',
  },
  rightview: {
    width: '70%',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div className = {classes.root}>
      <CssBaseline />
      <div className={classes.toproot}>
        <div className={classes.leftview}>
          <p>My URls</p>
        </div>
        <div className = {classes.rightview}>
          <p>Details</p>
        </div>
      </div>
      <div className={classes.bottomroot}>
        <RecentUrlContainer />
        <div>
          <p>Total clicks in the last month</p>
        </div>
        <div>
          <p>Recently added urls</p>
        </div>
      </div>
    </div>
  );
};
