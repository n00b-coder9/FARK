import {
  Button,
  Card,
  CardActions,
  CardHeader,
  LinearProgress,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { setIsSnackbarOpen } from '../../redux/slices/snackbar';
import { validateEmail, validateName, validatePassword } from '../../utils/validator';
import axios from '../../utils/axios';
import signupQuery from '../../graphQl/queries/signupQuery';

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
    },
  },
}));

function Register() {
  const [name, setName] = useState('');
  const [nameHasError, setNameHasError] = useState(false);
  const [nameErrMsg, setNameErrMsg] = useState('');
  const [email, setEmail] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [isFormEnabled, setFormEnabled] = useState(true);

  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // Get the path which redirected the user to this page
  const prevPath = location.state ? location.state.from : '/dashboard';

  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));

  // Handle submission of form data for registration
  const handleRegistrationForm = async (e) => {
    // If form is disabled, skip the submission
    if (!isFormEnabled) return;

    // Disable the form
    setFormEnabled(false);
    setNameHasError(false);
    setEmailHasError(false);
    setPasswordHasError(false);

    // Validate the inputs
    const nameValidity = validateName(name);
    const emailValidity = validateEmail(email);
    const passwordValidity = validatePassword(password);

    // Check if any error was found
    const errorFree = nameValidity.isValid &&
      emailValidity.isValid &&
      passwordValidity.isValid;

    // If any error was found, update the UI accordingly to inform the user
    if (!errorFree) {
      // Error in name
      if (!nameValidity.isValid) {
        setNameHasError(true);
        setNameErrMsg(nameValidity.message);
      }
      // Error in email
      if (!emailValidity.isValid) {
        setEmailHasError(true);
        setEmailErrMsg(emailValidity.message);
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
      const response = await axios().post('/', signupQuery({ name, email, password }));
      dispatch(setIsSnackbarOpen({
        isOpen: true, message: response.data.data.signUp.message, severity: 'success',
      }));

      history.replace({
        pathname: '/auth/login',
        state: { from: prevPath },
      });
    } catch (err) {
      // Allow user to submit the form again
      setFormEnabled(true);

      const error = err.response.data.errors[0];
      switch (error.code) {
        case 422: {
          // Wrong user input provided
          error.data.forEach((err) => {
            const key = err.key;
            if (key === 'name') {
              setNameHasError(true);
              setNameErrMsg(err.message);
            } else if (key === 'email') {
              setEmailHasError(true);
              setEmailErrMsg(err.message);
            } else if (key === 'password') {
              setPasswordHasError(true);
              setPasswordErrMsg(err.message);
            } else {
              dispatch(setIsSnackbarOpen({
                isOpen: true, message: 'An unknown error occured', severity: 'error',
              }));
            }
          });
          break;
        }
        case 409: {
          // User already exists
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
      <Card>
        <CardHeader title="Register"
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
        <form noValidate
          style={{
            padding: mediaMinSm ? '24px' : '4px',
            paddingLeft: mediaMinSm ? '32px' : '6px',
            paddingRight: mediaMinSm ? '32px' : '6px',
            width: mediaMinSm ? '400px' : '100%',
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegistrationForm(e);
          }}>
          {/* Name of the user */}
          <TextField
            error={nameHasError}
            value={name}
            label="Name"
            placeholder="Enter your name"
            onChange={(e) => {
              setName(e.target.value);
              setNameHasError(false);
              setNameErrMsg('');
            }}
            helperText={nameErrMsg}
          />
          {/* Email id */}
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
            type="email"
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
            {/* Register button */}
            <Button
              disabled={!isFormEnabled}
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginLeft: 'auto' }}
            >
              Register
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}

export default Register;
