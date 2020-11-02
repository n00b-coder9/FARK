import {
  Button,
  Card,
  CardActions,
  CardHeader,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import RecentUrlList from './RecentUrlList';
const useStyles = makeStyles((theme) => ({
  container: {
    width: '90%',
    height: '100%',
  },
}));

const RecentUrlContainer = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));

  const myUrlsHandler = () => {
    history.push({
      pathname: '/MyUrls',
    });
  };


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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '4px',
              paddingBottom: mediaMinSm ? '16px' : '6px',
              width: '100%',
            }}>
            <RecentUrlList />
          </div>
          <div style={{
            height: '10%',
            justifyContent: 'flex-start',
          }}>
            <Button onClick={myUrlsHandler} color='secondary'>
              See More
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>);
};

export default RecentUrlContainer;
