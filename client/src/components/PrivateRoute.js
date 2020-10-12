import React from 'react';
import { useLocation, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * This route wll be used when we want the user to be able to visit the route
 * only if they are logged in
 *
 * @usage
 * <PrivateRoute path="/a-sample-path">
 *      <PrivateComponent />
 * </PrivateRoute>
 * Use as a normal <Route> component. THhe componene to be rendered should be passed as child
 *
 * @return {Component}
 * The component if user is logged in else redirects to auth page
 */
function PrivateRoute({ children, ...rest }) {
  const location = useLocation();

  // Get login status
  const isLoggedIn = useSelector((state) => state.loggedIn.loggedIn);

  return (
    <Route
      {...rest}
      render={() => (isLoggedIn ? (
                // Logged in, render the children
                children
            ) : (
                // Not logged in, redirect to auth page
                <Redirect to={{ pathname: '/auth', state: { from: location } }} />
            ))}
    />
  );
}

export default PrivateRoute;
