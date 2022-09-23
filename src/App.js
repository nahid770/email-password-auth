import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registerd, setRegisterd] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleNameBlur = (event) =>{
    setName(event.target.value)
  }

  const handleEmailBlur = (e) =>{
    setEmail(e.target.value)
  }
  const handlePassword = e =>{
    setPassword(e.target.value)
  }

  const handleRegister = (e) =>{
    setRegisterd(e.target.checked)
  }

  const handleSubmit = event =>{
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // if(!/(?=.*?[#?!@$%^&*-])/.test(password)){
    //   setError('passwor should contain at least one special character')
    //   return;
    // }
    if(!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)){
      setError(' Password should have min 8 letter with at least a symbol, upper and lowercase letters and a number!')
      return;
    }
    setValidated(true);
    setError('')

    if(registerd){
      signInWithEmailAndPassword(auth, email, password)
      .then(result=>{
        const user = result.user;
        console.log(user)
        setSuccess('Login success')
      })
      .catch(error=>{
        console.error(error)
        setError(error.message)
      })
      
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
    .then(result=>{
      const user = result.user;
      console.log(user)
      setEmail('');
      setPassword('');
      varifyEmail();
      setSuccess('Registered successfully');
      setUserName();
    })
    .catch(error=>{
      console.error(error)
      setError(error.message)
    })
    }
    
    event.preventDefault();
  }


  const setUserName = () =>{
    updateProfile(auth.currentUser, {
       displayName:name
    })
    .then(()=>{
      console.log('updating name')
    })
    .catch(error=>{
      setError(error.message)
    })
  }

//  send email varification
  const varifyEmail = () =>{

    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log('Email varification send!')
    })
  }
// send password reset email
const handleResetPassword  = () =>{
  sendPasswordResetEmail(auth, email)
  .then(()=>{
    console.log('email ')
  })
}



  return (
    <div>
     <div className="registration w-50 mx-auto">
      
      <h2 className='text-info '>Please {registerd ? 'login':'registerd'}</h2>
     <Form noValidate validated={validated}  onSubmit={handleSubmit}>
  { !registerd && <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>your name</Form.Label>
    <Form.Control onBlur={handleNameBlur} type="text" placeholder="your name" required />
    <Form.Control.Feedback type="invalid">
          Please choose a name.
    </Form.Control.Feedback>
  </Form.Group>}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
        <Form.Control.Feedback type="invalid">
              Please choose a email.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onBlur={handlePassword} type="password" placeholder="Password" required />
        <Form.Control.Feedback type="invalid">
            Please choose a Password.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check onChange={handleRegister} type="checkbox" label="Already registerd?" />
      </Form.Group>
      <p className='text-danger'>{error}</p>
      <p className='text-success'>{success}</p>
      <Button onClick={handleResetPassword} variant="link">Forget password?</Button><br />
      <Button variant="primary" type="submit">
      {registerd ? 'login':'registerd'}
      </Button>
    </Form>
     </div>
    </div>
  );
}

export default App;
