import React, { Component } from 'react';
import * as validator from '../validator';
import Input from '../components/form/Input';
class Signup extends Component {
  state = {
    SignupForm: {
      email: {
        value: '',
        isValid: false,
        validation: [validator.isRequired , validator.isEmailValid]
      },
      name: {
        value: '',
        isValid: false,
        validation: [validator.isRequired]
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
      for (const validation of prevState.SignupForm[input].validation)
        isValid = isValid && validation(value);
      const updatedForm = {
        ...prevState.SignupForm,
        [input]: {
          ...prevState.SignupForm[input],
          value,
          isValid
        }
      }
      let isFormValid = true;
      for (const input in prevState.SignupForm)
      {
        isFormValid = isFormValid && input.isValid;
      }


      return {
        SignupForm: updatedForm,
        isFormValid
      }
    })
  }
  render() {
    return (<div>
      <form onSubmit={(e) => {
        this.props.onSignUp(e, {
          email: this.state.SignupForm.email.value,
          name: this.state.SignupForm.name.value,
          password: this.state.SignupForm.password.value
        })
      }}
        style={{ flex: 1 }}>
        <p>NAME</p>
        <Input
          label='name'
          id='name'
          type='name'
          name='name'
          placeholder='your name'
          value={this.state.SignupForm['name'].value}
          onChange={this.inputchangeHandler}
        />
        <br />
        <p>EMAIL</p>
        <Input
          id='email'
          type='email'
          name='email'
          label='email'
          placeholder='your email'
          value={this.state.SignupForm['email'].value}
          onChange={this.inputchangeHandler}
        />
        <br />
        <label title='password' />
        <p>PASSWORD</p>
        <Input
          id='password'
          type='password'
          name='password'
          value={this.state.SignupForm['password'].value}
          placeholder='your password'
          onChange={this.inputchangeHandler} 
        />
        <button title="SUBMIT" type='submit' name='SUBMIT'>
          SUBMIT
      </button>
      </form>
    </div>
    )
  }
}
export default Signup;