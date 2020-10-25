import React, { useState } from 'react';
import {
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
  Card,
  CardActions,
  Button,
  InputBase,
  CardHeader,
  Fade,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { validateUrl } from '../../utils/validator';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSnackbarOpen } from '../../redux/slices/snackbar';
import { useHistory, useLocation } from 'react-router-dom';
import shortenUrlQuery from '../../graphQl/queries/shortenUrlQuery';
import axios from '../../utils/axios';
import addDetailsQuery from '../../graphQl/queries/addDetailsQuery';

// define styles for this component
const useStyles = makeStyles((theme) => ({
  root: {
    'display': 'flex',
    'flexDirection': 'column',
    'height': '100%',
    'width': 'min(740px, 100%)',
    'margin': 'auto',
    '& form': {
      display: 'flex',
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  textBarSpacing: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  primaryBgColor: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  primaryContrastTextColor: {
    'color': theme.palette.getContrastText(theme.palette.error.main),
    '&.active': {
      color: 'inherit',
    }, '&.focus': {
      color: 'inherit',
    },
    '&.hover': {
      color: 'inherit',
    },
    '&.Mui-disabled': {
      color: 'gray',
    },
  },
}));

function Home() {
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Check if we have data from location's state.
  // This will be present if a non-logged in user wants to save the url
  const isShortenAndAuth = location.state && location.state.shortenDataAfterAuth;
  const shortenDataAfterAuth = isShortenAndAuth ? location.state.shortenDataAfterAuth : null;
  const [updatedShortUrl, setUpdatedShortUrl] = useState(
    isShortenAndAuth ? shortenDataAfterAuth.updatedShortUrl : '',
  );
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(isShortenAndAuth ? shortenDataAfterAuth.shortUrl : '');
  const [queryLongUrl, setQueryLongUrl] = useState('');
  const [isFormEnabled, setFormEnabled] = useState(true);
  const [longUrlHasError, setLongUrlHasError] = useState(false);
  const [longUrlErrMsg, setLongUrlErrMsg] = useState('');
  const [isShortUrlGen, setIsShortUrlGen] = useState(
    isShortenAndAuth ? shortenDataAfterAuth.isShortUrlGen : false,
  );
  const [urlTitle, setUrlTitle] = useState(isShortenAndAuth ? shortenDataAfterAuth.urlTitle : '');
  const [urlDescription, setUrlDescription] = useState(
    isShortenAndAuth ? shortenDataAfterAuth.urlDescription : '',
  );
  const [isDetailsFormEnabled, setDetailsFormEnabled] = useState(true);
  const [details, setDetails] = useState({
    title: isShortenAndAuth ? shortenDataAfterAuth.urlTitle : '',
    description: isShortenAndAuth ? shortenDataAfterAuth.urlDescription : '',
    shortUrl: isShortenAndAuth ? shortenDataAfterAuth.shortUrl : '',
  });
  const token = useSelector((state) => state.auth.authToken);
  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));

  const handleLongUrlform = async () => {
    if (!isFormEnabled) {
      return;
    }
    setFormEnabled(false);
    setLongUrlHasError(false);
    setDetailsFormEnabled(false);
    // check if url is valid
    const urlValidity = validateUrl(longUrl);
    const errorFree = urlValidity.isValid;

    if (!errorFree) {
      setLongUrlHasError(true);
      setLongUrlErrMsg(urlValidity.message);
      // if url is invalid ask the user to resubmit the form
      setDetailsFormEnabled(true);
      return setFormEnabled(true);
    }

    // If we are querying for the new url, disable the older one
    setIsShortUrlGen(false);

    // if error free then try to generate shortUrl
    try {
      const graphqlQuery = shortenUrlQuery({ longUrl });
      const response = await axios.post('/', graphqlQuery, {
        headers: {
          Authorization: token,
        },
      });

      setShortUrl(response.data.data.shortenUrl.shortUrl);
      setQueryLongUrl(response.data.data.shortenUrl.longUrl);
      setUpdatedShortUrl(response.data.data.shortenUrl.shortUrl);
      setUrlDescription(response.data.data.shortenUrl.description);
      setUrlTitle(response.data.data.shortenUrl.title);
      setDetails({
        title: response.data.data.shortenUrl.title,
        description: response.data.data.shortenUrl.description,
        shortUrl: response.data.data.shortenUrl.shortUrl,
      });
      setFormEnabled(true);
      setDetailsFormEnabled(true);
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
      setDetailsFormEnabled(true);
    }
  };

  // save the title and description of the url if entered
  const handleUrlDetails = async () => {
    if (!isDetailsFormEnabled) {
      return;
    }
    setDetailsFormEnabled(false);
    if (isLoggedIn) {
      /**
        *  User is logged in, editing url details
        *  try updating the url details and handle the errors*/
      try {
        const newDetails = {
          title: urlTitle,
          description: urlDescription,
          shortUrl: updatedShortUrl,
        };
        /**  Check if details have been updated or not
          *  If yes then proceed to send request to server
          *  Otherwise display appropriate message to the user
        */
        if (newDetails.title === details.title &&
          newDetails.description === details.description &&
          newDetails.shortUrl === details.shortUrl) {
          dispatch(setIsSnackbarOpen({
            isOpen: true,
            message: 'Update failed as fields have not been updated',
            severity: 'error',
          }));
          return setDetailsFormEnabled(true);
        }
        const graphqlQuery = addDetailsQuery({
          title: urlTitle,
          description: urlDescription,
          shortUrl,
          updatedShortUrl,
        });
        const response = await axios.post('/', graphqlQuery, {
          headers: {
            Authorization: token,
          },
        });
        const message = response.data.data.addDetails.message;
        // If updation is successfull then inform the user using the snackbar
        dispatch(setIsSnackbarOpen({
          isOpen: true, message: message, severity: 'success',
        }));
        setDetails(newDetails);
        setShortUrl(updatedShortUrl);
      } catch (err) {
        // handle the errors
        const error = err.response.data.errors[0];
        if (error.code === 422 || error.code === 409) {
          dispatch(setIsSnackbarOpen({
            isOpen: true, message: error.message, severity: 'error',
          }));
        } else {
          dispatch(setIsSnackbarOpen({
            isOpen: true, message: 'An unknown error occurred', severity: 'error',
          }));
        }
      }
    } else {
      /* User is not logged in, redirect to the auth page*/
      history.push({
        pathname: '/auth', state: {
          from: location,
          shortenDataAfterAuth: {
            isShortUrlGen, urlTitle, urlDescription, shortUrl, updatedShortUrl,
          },
        },
      });
    }
    return setDetailsFormEnabled(true);
  };

  // Long url input form
  let form = (
    <div style={{
      marginTop: '10vh',
    }}>
      <Card>
        <form noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleLongUrlform();
          }}>
          {/* Type long url here */}
          <InputBase
            autoFocus
            className={classes.textBarSpacing}
            style={{ flexGrow: 1 }}
            value={longUrl}
            label="Long url"
            placeholder="www.example.com/a/very/long/url?query=a+very+long+query"
            onChange={(e) => {
              setLongUrl(e.target.value);
              setLongUrlHasError(false);
              setLongUrlErrMsg('');
            }} />
          <CardActions className={classes.primaryBgColor}>
            {/* Submit shortening request */}
            <Button
              className={classes.primaryContrastTextColor}
              disabled={!isFormEnabled}
              type="submit"
              style={{ marginLeft: 'auto' }}>
              Shorten
            </Button>
          </CardActions>
        </form>
      </Card>
      {/* Error message */}
      <Fade in={longUrlHasError}>
        <div style={{ color: 'red', height: '1em', margin: '8px' }}>{longUrlErrMsg}</div>
      </Fade>
    </div>
  );

  // If short url has been generated render the final form
  if (isShortUrlGen) {
    form = (
      <Card style={{ marginTop: '10vh' }}>
        <CardHeader title="Short url"
          style={{
            backgroundColor: 'black', color: 'white',
            width: '100%',
          }} />
        {/* Form to save additional information of Url*/}
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleUrlDetails();
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '4px',
            paddingBottom: mediaMinSm ? '16px' : '6px',
            paddingLeft: mediaMinSm ? '32px' : '6px',
            paddingRight: mediaMinSm ? '32px' : '6px',
            width: '100%',
          }}
        >
          {/* Title */}
          <TextField
            title="Title"
            label="Title"
            value={urlTitle}
            onChange={(e) => {
              setUrlTitle(e.target.value);
            }}
            placeholder="Title"
          />
          {/* Long url */}
          <TextField
            title="Long url"
            label="Long url"
            placeholder="Long url"
            value={queryLongUrl}
            disabled
          />
          {/* Short url */}
          <div style={{ display: 'flex' }}>
            <TextField
              title="Short url"
              label="Short url"
              placeholder="Short url"
              value={updatedShortUrl}
              onChange={(e) => {
                setUpdatedShortUrl(e.target.value);
              }}
              style={{ flexGrow: 1 }}
            />
            {/* Button to copy short url */}
            <CardActions>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                  dispatch(setIsSnackbarOpen({
                    isOpen: true, message: 'Copied', severity: 'success',
                  }));
                }}>
              Copy
              </Button>
            </CardActions>
          </div>
          {/* Description */}
          <TextField
            title="Description"
            label="Description"
            value={urlDescription}
            onChange={(e) => {
              setUrlDescription(e.target.value);
            }}
            multiline={true}
            placeholder="Url Description"
          />
          <div style={{ display: 'flex' }}>
            {/* Time of creation */}
            <span
              style={{ flexGrow: 1, color: 'gray', margin: '8px', marginTop: '16px' }}>
              <em>{new Date().toDateString()}</em>
            </span>
            {/* Submit update */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
            Save
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <div className={classes.root}>
      {form}
      {/* Only show progress bar when form is disabled */}
      {!isFormEnabled &&
        // Show skeletion loading
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Skeleton
            variant="rect"
            style={{
              height: '64px',
            }} />
          <Skeleton
            variant="rect"
            style={{
              width: '50%',
              height: '32px',
              margin: '20px 16px 4px',
            }} />
          <Skeleton
            variant="rect"
            style={{
              width: '95%',
              height: '32px',
              margin: '8px 16px 4px',
            }} />
          <Skeleton
            variant="rect"
            style={{
              width: '78%',
              height: '32px',
              margin: '8px 4px 4px 16px',
            }} />
          <Skeleton
            variant="rect"
            style={{
              width: '65%',
              height: '32px',
              margin: '8px 16px 4px',
            }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton
              variant="text"
              style={{
                width: '10%',
                margin: '8px 4px 4px 16px',
              }} />
            <Skeleton
              variant="rect"
              style={{
                width: '12%',
                height: '32px',
                margin: '8px 20px 4px',
              }} />
          </div>
        </div>
      }
    </div>
  );
}
export default Home;
