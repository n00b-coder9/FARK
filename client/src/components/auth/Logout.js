import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';

import { setLogin } from '../../redux/slices/auth';

// Logs out the user when redirected to `/auth/logout`
function Logout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const prevPath = location.state ? location.state.from : '/';

  useEffect(() => {
    // Update redux state
    dispatch(setLogin({ isLoggedIn: false, authToken: null }));
  });

  // Redirect to the home page
  return <Redirect to={prevPath} />;
}

export default Logout;
