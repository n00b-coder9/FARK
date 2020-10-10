import React, { Component} from 'react';
import Input from '../components/form/Input';
import * as validator from '../validator';
class Login extends Component {
  state = {
    LoginForm: {
      email: {
        value: '',
        isValid: false,
        validation: [validator.isRequired , validator.isEmailValid]
      },
      password: {
        value: '',
        isValid: false,
        validation :[validator.isRequired,validator.isPasswordValid]
      }
    },
    isFormValid:false
  }
  inputchangeHandler= (input, value)=>{
    this.setState(prevState => {
      let isValid = true;
      for (const validation of prevState.LoginForm[input].validation)
        isValid = isValid && validation(value);
      const updatedForm = {
        ...prevState.LoginForm,
        [input]: {
          ...prevState.LoginForm[input],
          value,
          isValid
        }
      }
      let isFormValid = true;
      for (const input in prevState.LoginForm)
      {
        isFormValid = isFormValid && input.isValid;
      }


      return {
        LoginForm: updatedForm,
        isFormValid:isFormValid
      }
    })
  }
  
  render() {
    return (<div>
  <form onSubmit={(e) => {
    this.props.onLogin(e, {
      email: this.state.LoginForm.email.value,
      password: this.state.LoginForm.password.value
    })
  
  }
  }>
        <label title='email' />
        <p>EMAIL</p>
        <Input
          id='email'
          type='email'
          name='email'
          label='email'
          placeholder='your email'
          value={this.state.LoginForm['email'].value}
          onChange={this.inputchangeHandler}
        />
        <br />
        <label title='password' />
        <p>PASSWORD</p>
        <Input
          id='password'
          type='password'
          name='password'
          label='password'
          value={this.state.LoginForm['password'].value}
          placeholder='your password'
          onChange={this.inputchangeHandler} 
        />
        <button type='submit'>
          SUBMIT
      </button>
      </form>
    </div>
    )
  }
}
export default Login;