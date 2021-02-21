import {
  Card,
  CardActions,
  CardHeader,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import UrlList from './UrlList';

// Create styles for the component
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    flexBasis: '50%',
  },
}));

// Url Container component
const UrlContainer = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div className={classes.container}>
      <Card style={{
        flex: 1,
        height: '90%',
      }}>
        <CardHeader
          title = 'My Urls'
          style={{
            width: '100%',
            height: '10%',
            color: 'white',
            background: 'black',
          }} />
        <CardActions style={{
          display: 'flex',
          flexDirection: 'column',
          height: '70%',
        }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '4px',
              paddingBottom: mediaMinSm ? '16px' : '6px',
              width: '100%',
            }}>
            <UrlList />
          </div>
        </CardActions>
      </Card>
    </div>);
};

export default UrlContainer;
