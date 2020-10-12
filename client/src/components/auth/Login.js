import { InputBase } from '@material-ui/core';
import React from 'react';
function Login() {
  return (<div>
    <form
    >
      <label title='email' />
      <p>EMAIL</p>
      <InputBase
        id='email'
        type='email'
        name='email'
        label='email'
        placeholder='your email'
      />
      <br />
      <label title='password' />
      <p>PASSWORD</p>
      <InputBase
        id='password'
        type='password'
        name='password'
        label='password'
        placeholder='your password'
      />
      <button type='submit'>
                    SUBMIT
      </button>
    </form>
  </div>
  );
}
export default Login;
