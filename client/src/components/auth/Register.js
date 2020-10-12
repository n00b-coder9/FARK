import { Button, Card, CardActions, CardHeader, makeStyles, TextField, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormEnabled, setFormEnabled] = useState(true);
  const [nameHasError, setNameHasError] = useState(false);
  const [nameErrMsg, setNameErrMsg] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordErrMsg, setPasswordErrMsg] = useState('');


  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();

  const mediaMinSm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div className={classes.root}>
      <Card
        style={{
          padding: mediaMinSm ? '24px' : '4px',
          paddingLeft: mediaMinSm ? '32px' : '6px',
          paddingRight: mediaMinSm ? '32px' : '6px',
          width: mediaMinSm ? '400px' : '100%',
        }}>
        <CardHeader title="Register"/>
        <form noValidate>
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
