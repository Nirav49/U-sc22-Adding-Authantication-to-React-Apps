import { useState, useRef,useContext } from 'react';
import classes from './AuthForm.module.css';
import authContext from '../../store/auth-context';
import {useHistory} from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();
  const emailPasswordRef = useRef();
  const authCtx = useContext(authContext);
  const history = useHistory();


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    const emails = emailRef.current.value;
    const passwords = emailPasswordRef.current.value;
    console.log(emails, passwords)
    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzpe845CouN7mPCO2HPg7HW-BEkITnRF4'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzpe845CouN7mPCO2HPg7HW-BEkITnRF4'
    }
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: emails,
          password: passwords,
          returnSecureToken: true
        }),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(res => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            let messages = 'authantication failed..!..'
            throw new Error(messages);
          });
        }
      }).then(data => {
        const expirationTime = new Date(
          (new Date().getTime() + (+data.expiresIn*1000)));

       authCtx.login(data.idToken,expirationTime.toISOString())
       history.replace('/');
      }).catch(err => {
        alert(err.message);
      })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitFormHandler}>
        <div className={classes.control}>
          <label >Your Email</label>
          <input type='email' required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label >Your Password</label>
          <input type='password' required ref={emailPasswordRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
