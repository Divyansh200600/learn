'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../../utils/Firebase/firebaseConfig';
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  InputAdornment, 
  Typography 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SettingDesktopPage() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkUserProvider = () => {
      const user = auth.currentUser;
      if (user && user.providerData[0].providerId === 'google.com') {
        setIsGoogleUser(true);
      }
    };
    checkUserProvider();
  }, []);

  const handleChangePassword = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You are not authenticated.');
      }
      if (user.providerData[0].providerId === 'google.com') {
        setErrorMsg('Password changes are not supported for Google sign-in users.');
        return;
      }
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      // Create credentials for re-authentication
      const credential = EmailAuthProvider.credential(user.email, password);

      // Re-authenticate the user
      await reauthenticateWithCredential(user, credential);

      // Update the password if re-authentication was successful
      await updatePassword(user, newPassword);
      toast.success('Your password has been updated successfully!');
      setOpenPasswordDialog(false);
    } catch (error) {
      // Display specific Firebase error messages
      console.error('Error changing password:', error);
      switch (error.code) {
        case 'auth/wrong-password':
          toast.error('The current password you entered is incorrect.');
          break;
        case 'auth/weak-password':
          toast.error('The new password is too weak. Please choose a stronger password.');
          break;
        case 'auth/requires-recent-login':
          toast.error('You need to re-authenticate to change your password.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address.');
          break;
        default:
          toast.error(
            error.message || 'Failed to update password. Please try again.'
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button
        variant="contained"
        color="secondary"
        width={"50px"}
        onClick={() => setOpenPasswordDialog(true)}
        style={{ marginTop: '10px' }}
      >
        Change Password
      </Button>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {isGoogleUser ? (
            <Typography color="error" variant="body2">
              You have signed in with Google. Password changes are not supported for Google sign-in users.
            </Typography>
          ) : (
            <>
              {errorMsg && (
                <Typography color="error" variant="body2" style={{ marginBottom: '10px' }}>
                  {errorMsg}
                </Typography>
              )}
              <TextField
                label="Current Password"
                type={showOldPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle old password visibility"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle new password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} color="primary">
            Cancel
          </Button>
          {!isGoogleUser && (
            <Button
              onClick={handleChangePassword}
              color="secondary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
