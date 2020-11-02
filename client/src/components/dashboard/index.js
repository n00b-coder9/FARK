import React from 'react';
import {
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import UrlContainer from './RecentUrlcontainer';
import PieChart from './Graph/PieChart';
import LineChart from './Graph/LineChart';

// Create styles for this component
const useStyles = makeStyles((theme) => ({
  root: {
    'display': 'flex',
    'height': '100%',
    'width': 'min(740px, 100%)',

  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flexGrow: 3,
  },
  rightContainer: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 2,
  },
}));

// Function to render the Dashboard component
export default function Dashboard() {
  const classes = useStyles();
  return (
    <div className = {classes.root}>
      <CssBaseline />
      <div className={classes.leftContainer}>
        <LineChart />
        <UrlContainer />
      </div>
      <div className={classes.rightContainer}>
        <PieChart variant='Clicks_by_location' />
        <PieChart variant='Clicks_by_urls'/>
      </div>
    </div>
  );
};
