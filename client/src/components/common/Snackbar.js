import PropTypes from 'prop-types';
import React from 'react';
import { Slide, Snackbar as SBar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

/**
 * Snackbar component to use in this app.
 *
 * @usage
 * You need not render this component anywhere. Just dispatch an action defined in the slices.
 *
 * dispatch(setIsSnackbarOpen({
 *  isOpen: true|false, message: 'Your message string', severity: 'info'|'warning'|'success'|'error'
 * }))
 */
function Snackbar(props) {
  return (
    <SBar
      open={props.open}
      autoHideDuration={3000}
      onClose={props.onClose}
      TransitionComponent={TransitionLeft}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MuiAlert
        severity={props.severity}
        onClose={props.onClose}
      >
        {props.message}
      </MuiAlert>
    </SBar>
  );
}

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}


Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  severity: PropTypes.string.isRequired,
};

export default Snackbar;
