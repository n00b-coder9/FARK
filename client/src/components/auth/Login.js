import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  TextField,
  Card,
  CardHeader,
  CardActions,
  Button,
  useMediaQuery,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import {
  validateEmail,
  validatePassword,
} from '../../utils/validator';
import axios from '../../utils/axios';
import loginQuery from '../../graphQl/queries/loginQuery';
import { setIsSnackbarOpen } from '../../redux/slices/snackbar';
import { setLogin } from '../../redux/slices/auth';

// Define styles for this component
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
      width: '100%',
    },
  },
}));

function Login() {
  const [email, setEmail] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [isFormEnabled, setFormEnabled] = useState(true);

  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get the path which redirected the user to this page
  const prevPath = location.state ? location.state.from : '/dashboard';

  // Define media query breakpoints for this component
  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));

  // Handle submission of form data for login
  const handleLoginForm = async () => {
    // If form is disabled, skip the submission
    if (!isFormEnabled) return;

    // Disable the form
    setFormEnabled(false);
    setEmailHasError(false);
    setPasswordHasError(false);

    // Validate the inputs
    const emailValidity = validateEmail(email);
    const passwordValidity = validatePassword(password);

    // Check if any error was found
    const errorFree = emailValidity.isValid && passwordValidity.isValid;

    // If any error was found, update the UI accordingly to inform the user
    if (!errorFree) {
      // Error in email
      if (!emailValidity.isValid) {
        setEmailHasError(true);
        setEmailErrMsg('Invalid email');
      }
      // Error in password
      if (!passwordValidity.isValid) {
        setPasswordHasError(true);
        setPasswordErrMsg(passwordValidity.message);
      }

      // Let user submit the form again
      return setFormEnabled(true);
    }

    // No error was found, try creating the user
    try {
      const graphqlQuery = loginQuery({ email, password });
      const response = await axios.post('/', graphqlQuery);

      // User login successful, update the ui and redirect to the dashboard
      dispatch(setIsSnackbarOpen({
        isOpen: true, message: 'Login successful', severity: 'success',
      }));

      // Get the jwt and store in redux and local storage
      const authToken = response.data.data.login.token;
      dispatch(setLogin({ isLoggedIn: true, authToken }));

      history.replace(prevPath);
    } catch (err) {
      // Allow user to submit the form again
      setFormEnabled(true);

      const error = err.response.data.errors[0];
      switch (error.code) {
        case 404: {
          // User not found
          dispatch(setIsSnackbarOpen({
            isOpen: true, message: error.message, severity: 'error',
          }));
          break;
        }
        case 401: {
          // Wrong password
          dispatch(setIsSnackbarOpen({
            isOpen: true, message: error.message, severity: 'error',
          }));
          break;
        }
        default: {
          // Unknown error
          dispatch(setIsSnackbarOpen({
            isOpen: true, message: 'An unknown error occured', severity: 'error',
          }));
        }
      }
    }
  };

  return (
    <div className={classes.root}>
      <Card
      >
        <CardHeader title="Login"
          style={{
            backgroundColor: 'black', color: 'white',
            padding: mediaMinSm ? '24px' : '4px',
            paddingLeft: mediaMinSm ? '32px' : '6px',
            paddingRight: mediaMinSm ? '32px' : '6px',
            width: mediaMinSm ? '400px' : '100%',
          }} />
        {/* Only show progress bar when form is disabled */}
        <LinearProgress
          variant="query"
          style={{
            width: mediaMinSm ? '400px' : '100%',
            visibility: isFormEnabled ? 'hidden' : 'visible',
          }}
        />
        {/* Login form */}
        <form noValidate onSubmit={(e) => {
          e.preventDefault();
          handleLoginForm();
        }}
        style={{
          padding: mediaMinSm ? '24px' : '4px',
          paddingLeft: mediaMinSm ? '32px' : '6px',
          paddingRight: mediaMinSm ? '32px' : '6px',
          width: mediaMinSm ? '400px' : '100%',
        }}>
          {/* Email */}
          <TextField
            error={emailHasError}
            helperText={emailErrMsg}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailHasError(false);
              setEmailErrMsg('');
            }}
            value={email}
            label="Email"
            placeholder="Enter your email"
          />
          {/* Password */}
          <TextField
            error={passwordHasError}
            helperText={passwordErrMsg}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordHasError(false);
              setPasswordErrMsg('');
            }}
            value={password}
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <CardActions>
            {/* Login button */}
            <Button
              disabled={!isFormEnabled}
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginLeft: 'auto' }}
            >
                Login
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}

export default Login;
