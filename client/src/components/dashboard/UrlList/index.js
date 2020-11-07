import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSnackbarOpen } from '../../../redux/slices/snackbar';
import { fetchUrls, setSelectedUrl } from '../../../redux/slices/urls';
import './index.css';

// Create the styles for the components
const useStyles = makeStyles((theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
}));

// Function to style and render an url item
const UrlItem = ({ url, onClick, active }) => {
  // Extract and store the date of creation
  const createdAt = new Date(url.createdAt).toDateString().substring(4);
  /** Check if current url has been clicked or not
   * if yes then then extract its length
   * else store 0
   */
  const clicksLength = url.clicks ? url.clicks.length : 0;

  return (
    <div className={active ? 'item active' : 'item'} onClick={onClick} style={{
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '0.25px solid grey',
      cursor: 'pointer',
    }}>
      <div style={{
        textAlign: 'center',
        width: '20%',
      }}>
        <p>{createdAt}</p>
      </div>
      <div style={{
        textAlign: 'center',
        width: '20%',
      }}>
        <p>{url.title}</p>
      </div>
      <div style={{
        textAlign: 'center',
        width: '20%',
      }}>
        <p>{url.shortUrl}</p>
      </div>
      <div style={{
        textAlign: 'center',
        width: '20%',
      }}>
        <p>{clicksLength}</p>
      </div>
    </div>
  );
};

const UrlList = (props) => {
  const [selected, setSelected] = useState();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.authToken);
  const urls = useSelector((state) => state.urls.urls);
  const error = useSelector((state) => state.urls.error);

  /** Function to dispatch the fetch Urls reducer
    * which updates the url list current component is using if neccessary
    */
  const fetchingUrls = useCallback(() => {
    // fetch the urls only if user is logged in
    if (token) {
      dispatch(fetchUrls({ token }));
    }
  }, [dispatch, token]);
  // Slice out the five most recent Urls

  useEffect(() => {
    fetchingUrls();
  },
  [fetchingUrls]);

  // If there is some error in fetching urls then notify the user accordingly
  if (error) {
    dispatch(setIsSnackbarOpen({
      status: 'open',
      message: 'Some Unknown Error occured in fetching urls, Please Refresh',
      severity: 'error',
    }));
  }
  return (
    <div className={classes.list}>

      <div style={{
        paddingTop: '0px',
        paddingLeft: '2px',
        width: '100%',
        height: '8%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        textAlign: 'end',
        borderBottom: '0.25px solid grey',
      }}> <div style={{
          textAlign: 'center',
          width: '20%',
        }}>
          <p>Date</p>
        </div>
        <div style={{
          textAlign: 'center',
          width: '20%',
        }}>
          <p>Title</p>
        </div>
        <div style={{
          textAlign: 'center',
          width: '20%',
        }}>
          <p>Short Url</p>
        </div>
        <div style={{
          textAlign: 'center',
          width: '20%',
        }}>
          <p>Clicks</p>
        </div>
      </div>
      <div style={{
        height: '80%',
        overflowY: 'scroll',
      }}>
        {urls.map((url, index) => {
          return <UrlItem url={url} key={index} active={index === selected} onClick={() => {
            dispatch(setSelectedUrl({ selectedUrl: url }));
            return setSelected(index);
          }}/>;
        })}
      </div>
    </div>
  );
};

UrlItem.propTypes = {
  url: PropTypes.object,
  onClick: PropTypes.func,
  active: PropTypes.bool,
};

export default UrlList;
