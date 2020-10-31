import {
  Card,
  CardActions,
  CardHeader,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import RecentUrlList from './RecentUrlList';
const useStyles = makeStyles((theme) => ({
  container: {
    width: '90%',
    height: '100%',
  },
}));

const RecentUrlContainer = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Card style={{
        height: '100%',
      }}>
        <CardHeader
          title = 'Recent Urls'
          style={{
            width: '100%',
            height: '15%',
            color: 'white',
            background: 'black',
          }} />
        <CardActions style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <RecentUrlList />
        </CardActions>
      </Card>
    </div>);
};

export default RecentUrlContainer;
