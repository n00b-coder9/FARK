import React from 'react';
import {
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import RecentUrlContainer from './RecentUrlcontainer';
import PieChart from './Graph/PieChart';
import LineChart from './Graph/LineChart';
const useStyles = makeStyles((theme) => ({
  root: {
    'display': 'flex',
    'height': '100%',
    'width': 'min(740px, 100%)',

  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 3,
  },
  rightContainer: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flexGrow: 2,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div className = {classes.root}>
      <CssBaseline />
      <div className={classes.leftContainer}>
        <LineChart />
        <RecentUrlContainer />
      </div>
      <div className={classes.rightContainer}>
        <PieChart variant='Recent-clicks' />
        <PieChart />
      </div>
    </div>
  );
};
