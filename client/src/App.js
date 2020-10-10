import React, { Component }  from 'react';
import { Route ,withRouter,Switch, NavLink} from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import loginQuery from './graphQl/queries/loginQuery';
import signupQuery from './graphQl/queries/signupQuery';
import './App.css';

class App extends Component {

  loginHandler = (event, authdata) => {
    event.preventDefault();
    const graphqlQuery = loginQuery(authdata);
    fetch('http://localhost:8080/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(graphqlQuery)
      })
      .then(res => {
        return res.json;
      }
    ).then(resData => {
      if (resData.errors && resData.errors[0].status === 422)
      {
        throw new Error('Validation Failed ! Make Sure the email Address is correct');
      }
      if (resData.errors)
      {
        throw new Error('Validation Failed');
      }
      console.log(resData);
    }
    )
  }
  signupHandler = (event, UserInputData) => {
    event.preventDefault();
    const graphqlQuery = signupQuery(UserInputData);
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    }).then(
      res => {
        return res.json;
      }
    ).then(
      resData => {
        if (resData.errors && resData.errors[0].status === 422)
        {
          throw new Error('Validation Failed ! Make sure the email isnt used yet .');
        }
        if (resData.errors)
        {
          throw new Error('User Creation failed');
        }
        console.log(resData);
      }
    ).catch(err => {
      console.log(err);
    })
  }
  render(){
    return (
    <div>
      <header style={{flexDirection:"row",padding:10,margin:10}}>
        <NavLink style={{margin:10}} to='/'>Home</NavLink>
        <NavLink style={{margin:10}} to='/signup'>SignUp</NavLink>
        <NavLink style={{margin:10}} to='/login'>Login</NavLink>
      </header>
      <Switch>
          <Route exact path='/signup' component={() => <Signup onSignUp={this.signupHandler}/>} />
          <Route exact path='/login' component={() => <Login onLogin={this.loginHandler}/>} /> 
          <Route path='/' component={Feed}/>
      </Switch>
    </div>); 
}
}

export default withRouter(App);
