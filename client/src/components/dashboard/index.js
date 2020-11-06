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
    margin: '10px',
  },
  container: {
    'display': 'flex',
    'height': '100%',
    'width': '100%',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
    flexGrow: 3,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
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
      <main className={classes.container}>
        <div className={classes.leftContainer}>
          <LineChart />
          <UrlContainer />
        </div>
        <div className={classes.rightContainer}>
          <PieChart variant='Clicks_by_location' />
          <PieChart variant='Clicks_by_urls'/>
        </div>
      </main>
    </div>
  );
};
