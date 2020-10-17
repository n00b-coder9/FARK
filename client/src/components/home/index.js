import React, { useState } from 'react';
import {
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
  Card,
  Button, CardActions,
  CardHeader,
  LinearProgress,
} from '@material-ui/core';
import { validateUrl } from '../../utils/validator';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSnackbarOpen } from '../../redux/slices/snackbar';
import { useHistory, useLocation } from 'react-router-dom';
import shortenUrlQuery from '../../graphQl/queries/shortenUrlQuery';
import axios from '../../utils/axios';
// define styles for this component
const useStyles = makeStyles((theme) => ({
  root: {
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignItems': 'center',
    'height': '100%',
    '& form': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  generateButton: {
    padding: '16px',
    width: '250px',
  },
  cardHeader: {
    height: '20%',
    width: '100%',
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(localStorage.getItem('shortUrl') == null ? '' :
  localStorage.getItem('shortUrl'));
  const [isFormEnabled, setFormEnabled] = useState(true);
  const [longUrlHasError, setLongUrlHasError] = useState(false);
  const [longUrlErrMsg, setLongUrlErrMsg] = useState('');
  const [isShortUrlGen, setIsShortUrlGen] = useState(
      localStorage.getItem('isShortUrlGen') === 'true');
  const [urlTitle, setUrlTitle] = useState(localStorage.getItem('urlTitle') === null ? '' :
  localStorage.getItem('urlTitle'));
  const [urlDescription, setUrlDescription] = useState(localStorage.getItem('urlDescription') ===
  null ? '' : localStorage.getItem('urlDescription'));
  const [isDetailsFormEnabled, setDetailsFormEnabled] = useState(true);
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userId = useSelector((state) => state.auth.user);
  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));
  const handleLongUrlform = async () => {
    if (!isFormEnabled) {
      return;
    }
    setFormEnabled(false);
    setLongUrlHasError(false);
    // check if url is valid
    const UrlValidity = validateUrl(longUrl);
    const errorFree = UrlValidity.isValid;

    if (!errorFree) {
      setLongUrlHasError(true);
      setLongUrlErrMsg(UrlValidity.message);
      // if url is invalid ask the user to resubmit the form
      return setFormEnabled(true);
    }
    // if error free then try to generate shortUrl
    try {
      const graphqlQuery = shortenUrlQuery({ longUrl, userId: userId === null ? 'guest' : userId });
      const response = await axios.post('/', graphqlQuery);
      setShortUrl(response.data.data.shortenUrl.shortUrl);
      setFormEnabled(true);
      return setIsShortUrlGen(true);
    } catch (err) {
      // allow user to resubmit the form
      // handle the various errors

      const error = err.response.data.errors[0];
      if (error.code === 422) {
        dispatch(setIsSnackbarOpen({
          isOpen: true, message: error.message, severity: 'error',
        }));
      } else {
        dispatch(setIsSnackbarOpen({
          isOpen: true, message: 'An unknown error occurred', severity: 'error',
        }));
      }
      setFormEnabled(true);
    }
  };
  // save the title and description of the url if entered
  const handleUrlDetails = async () => {
    if (!isDetailsFormEnabled) {
      return;
    }
    setDetailsFormEnabled(false);
    if (isLoggedIn) {
      /* TODO: if user is logged in then allow him to add title/description */
    } else {
      /* if user is not logged in then redirect him to the auth page*/
      localStorage.setItem('isShortUrlGen', isShortUrlGen);
      localStorage.setItem('urlTitle', urlTitle);
      localStorage.setItem('urlDescription', urlDescription);
      localStorage.setItem('shortUrl', shortUrl);
      history.push({ pathname: '/auth', state: { from: location } });
    }
  };
  // the base url
  const baseUrl = axios.getConfig().baseURL;
  // content to be rendered before short url is generated
  let content = (
    <div style={{
      flexDirection: 'column',
      padding: mediaMinSm ? '24px' : '4px',
      paddingLeft: mediaMinSm ? '32px' : '6px',
      paddingRight: mediaMinSm ? '32px' : '6px',
    }}>
      <form noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleLongUrlform();
        }}>
        <TextField
          label="BASE URL"
          id="base-url"
          variant="filled"
          value={baseUrl}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          error={longUrlHasError}
          helperText={longUrlErrMsg}
          value={longUrl}
          label="PASTE YOUR LONG URL HERE"
          placeholder="something like www.google.com"
          onChange={(e) => {
            setLongUrl(e.target.value);
            setLongUrlHasError(false);
            setLongUrlErrMsg('');
          }}/>
        <CardActions>
          <Button
            disabled={!isFormEnabled}
            type="submit"
            color="primary"
            variant="contained"
            style={{ marginLeft: 'auto' }}>
        Create
          </Button>
        </CardActions>
      </form>
    </div>);
  // if shorturl has been generated render this instead
  if (isShortUrlGen) {
    content = (
      <div style={{
        flexDirection: 'column',
        padding: mediaMinSm ? '24px' : '4px',
        paddingLeft: mediaMinSm ? '32px' : '6px',
        paddingRight: mediaMinSm ? '32px' : '6px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
          <TextField
            InputLabelProps={{ style: { fontWeight: 'bold', color: 'orange' } }}
            style={{
              width: '100%',
              padding: '0px',
              margin: '0px',
            }}
            label="SHORT URL"
            value={shortUrl}
          />
          {/* button to copy short url */}
          <Button
            style={{
              position: 'absolute',
              color: 'orange',
              zIndex: '2',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigator.clipboard.writeText(shortUrl);
              dispatch(setIsSnackbarOpen({
                isOpen: true, message: 'Copied', severity: 'success',
              }));
            }}>
            Copy
          </Button>
        </div>
        {/* displaying the time of creation */}
        <p style={{ textAlign: 'center' }}>CREATED AT {new Date().toDateString()}</p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* form to save additional information of Url*/}
          <form noValidate onSubmit={(e) => {
            e.preventDefault();
            handleUrlDetails();
          }}>
            <TextField
              title="Title"
              label="Title"
              value={urlTitle}
              onChange={(e) => {
                setUrlTitle(e.target.value);
              }}
              multiline="true"
              placeholder="Url title (optional)"
              variant="outlined"
            />
            <TextField
              title="Description"
              label="Description"
              value={urlDescription}
              onChange={(e) => {
                setUrlDescription(e.target.value);
              }}
              multiline="true"
              placeholder="Url Description (optional)"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                width: '30%',
                marginLeft: 'auto',
              }}>
            Add
            </Button>
          </form>
        </div>
      </div>);
  }
  return (
    <div className={classes.root}>
      {!isFormEnabled &&
        <LinearProgress variant="query" style={{ width: mediaMinSm ? '400px' : '100%' }} />
      }
      <Card style={{
        width: mediaMinSm ? '400px' : '100%',
      }}>
        <CardHeader
          className={classes.cardHeader}
          title="CREATE LINK"
        />
        {content}
      </Card>
    </div>
  );
}
export default Home;
