import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, firestore } from '../../../utils/Firebase/firebaseConfig';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupMode, setSignupMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success('Login successful');
      console.log(user.uid); // Log the user ID
      onLogin(user.uid); // Pass user ID to parent component
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed');
    }
  };

  const handleSignup = async () => {
    const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password.match(passwordValidation)) {
      toast.error('Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const usersRef = collection(firestore, 'users');
      await setDoc(doc(usersRef, user.uid), {
        name: name,
        email: email,
        uid: user.uid,
        suid: generateSuid(),
      });

      toast.success('Signup successful');
      setSignupMode(false);
      console.log(user.uid); // Log the user ID
      onLogin(user.uid); // Pass user ID to parent component
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Signup failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error('Error sending password reset email');
    }
  };

  const generateSuid = () => {
    // Function to generate random 7-digit number
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container
      maxWidth="xs"
      style={{
       
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        top: '10px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px', // Adjust maxWidth to ensure it scales well
          boxSizing: 'border-box', // Ensure padding doesn't overflow
        }}
      >
        <Typography
          variant="h4"
          style={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', color: 'black' }}
        >
          {signupMode ? 'Sign Up' : 'Login'}
        </Typography>
        {signupMode && (
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {signupMode ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignup}
            style={{ marginTop: '1rem' }}
          >
            Sign Up
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={{ marginTop: '1rem' }}
          >
            Login
          </Button>
        )}
        <Typography
          variant="body1"
          style={{ color: '#38a169', cursor: 'pointer', marginTop: '0.5rem', textAlign: 'center' }}
          onClick={() => setSignupMode(!signupMode)}
        >
          {signupMode ? 'Already have an account? Login here' : "Don't have an account? Sign Up"}
        </Typography>
        {!signupMode && (
          <Typography
            variant="body1"
            style={{ color: '#38a169', cursor: 'pointer', marginTop: '0.5rem', textAlign: 'center' }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Typography>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
};

export default LoginPage;