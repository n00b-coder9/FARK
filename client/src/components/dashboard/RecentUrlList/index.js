/* eslint-disable no-invalid-this */
/* eslint-disable react/prop-types */
import { makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls, setSelectedUrl } from '../../../redux/slices/urls';
import './index.css';
const useStyles = makeStyles((theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
}));
const UrlItem = ({ url, onClick, active }) => {
  const createdAt = new Date(url.createdAt).toDateString().substring(4);
  const clicksLength = url.clicks ? url.clicks.length : 0;
  return (
    <div className={active ? 'item active' : 'item'} onClick={onClick} style={{
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: 'solid',
      borderBottomWidth: '0.25px',
      borderBottomColor: 'grey',
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
const RecentUrlList = (props) => {
  const [selected, setSelected] = useState();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.authToken);
  const urls = useSelector((state) => state.urls.urls);
  const fetchingUrls = useCallback(() => {
    dispatch(fetchUrls({ token }));
  }, [dispatch, token]);
  const UrlsbyRecency = urls.slice(0, 5);
  useEffect(() => {
    fetchingUrls();
  },
  [fetchingUrls]);
  return (
    <div className={classes.list}>

      <div style={{
        paddingTop: '0px',
        paddingLeft: '2px',
        width: '100%',
        height: '12%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        textAlign: 'end',
        borderBottom: 'solid',
        borderBottomWidth: '0.25px',
        borderBottomColor: 'grey',
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
      {UrlsbyRecency.map((url, index) => {
        return <UrlItem url={url} key={index} active={index === selected} onClick={() => {
          dispatch(setSelectedUrl({ selectedUrl: url }));
          return setSelected(index);
        }}/>;
      })}
    </div>
  );
};

export default RecentUrlList;
