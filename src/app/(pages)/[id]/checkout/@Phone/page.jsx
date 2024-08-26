'use client';

import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '../../../../../assets/gif/checkout.gif';
import TermsOfService from '../../../../../components/courseComponents/terms-of-service/page';
import { auth, db } from '../../../../../utils/Firebase/firebaseConfig';

const steps = ['Login', 'Agreement', 'Payment'];

const PhoneCheckoutPage = ({ params }) => {
  const [user] = useAuthState(auth);
  const [activeStep, setActiveStep] = useState(user ? 1 : 0);
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = params;
  const [agreed, setAgreed] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const invoiceContainerRefs = useRef({});

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData({ ...docSnap.data(), uid: userId });
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user]);

  const fetchCourseData = async (courseId) => {
    try {
      const courseRef = doc(collection(db, 'courses'), courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourseData({ ...courseSnap.data(), courseId });
      } else {
        console.error('No such course document!');
      }
    } catch (error) {
      console.error('Error fetching course document:', error);
    }
  };

  useEffect(() => {
    fetchCourseData(id);
  }, [id]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { email: user.email, name: user.displayName, uid: user.uid });
      setActiveStep(1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to log in. Please try again.', { autoClose: 3000 });
    }
  };

  const handleNext = () => {
    if (!user && activeStep > 0) {
      toast.error('Please log in to proceed!', { autoClose: 3000 });
    } else if (activeStep === steps.length - 1) {
      handlePayment();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePayment = async () => {
    const paymentData = {
      amount: discountedPrice !== null ? discountedPrice : courseData.salePrice,
      name: userData.name,
      uid: userData.uid,
      email: userData.email,
      suid: userData.suid,
      courseId: courseData.courseId,
      courseName: courseData.name,
      currency: 'INR',
      date: new Date().toISOString(),
    };
  
  
    try {
      // Step 1: Request a payment token
      const createResponse = await fetch('https://pz-api-system.pulsezest.com/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
  
      if (!createResponse.ok) {
        console.error('Failed to create payment token:', await createResponse.text());
        throw new Error('Failed to create payment token');
      }
  
      const { redirectUrl } = await createResponse.json();
      console.log('Received redirect URL:', redirectUrl);
  
      // Step 2: Redirect the user to the URL to view the payment data
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Payment error:', error);
    }
  };


  const handleAgreement = () => {
    setAgreed(true);
  };

  const applyCoupon = async () => {
    console.log('Applying coupon:', couponCode);

    try {
      // Ensure course data is loaded
      if (!courseData) {
        setCouponError('Course data is not available.');
        return;
      }

      // Check if the coupon code exists in the courseData
      const couponData = courseData.couponCodes[couponCode];

      if (couponData) {
        if (couponData.status === "online") {
          // Apply the discount
          const discount = couponData.price;
          const finalPrice = courseData.salePrice - discount;
          setDiscountedPrice(finalPrice);
          setCouponError(null);

          console.log('Discount applied:', discount);
          console.log('Final price:', finalPrice);
        } else {
          setCouponError('Coupon code is not valid or expired.');
          console.log('Coupon code is not valid or expired.');
        }
      } else {
        setCouponError('Invalid coupon code.');
        console.log('Invalid coupon code or no document found for this coupon.');
      }
    } catch (error) {
      console.error('Error applying coupon code:', error.message);
      setCouponError('Failed to apply coupon. Please try again.');
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Typography variant="body1" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              This is the login step where users can log in using their Google account or mobile OTP.
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              {!user ? 'Please log in to proceed.' : 'You are already logged in.'}
            </Typography>
            {!user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGoogleLogin}
                  startIcon={<GoogleIcon />}
                  style={{ backgroundColor: '#001d3d' }}
                >
                  Login with Google
                </Button>

                <Typography variant="subtitle1" style={{ margin: '0 10px' }}>OR</Typography>

                <Input
                  type="text"
                  placeholder="Phone Number"
                  style={{
                    backgroundColor: '#f1f1f1',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    width: '140px'
                  }}
                />

                <Input
                  type="text"
                  placeholder="OTP"
                  style={{
                    backgroundColor: '#f1f1f1',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    width: '100px'
                  }}
                />

                <Button variant="contained" style={{ backgroundColor: '#001d3d' }}>
                  Login with OTP
                </Button>
              </div>
            )}
          </>
        );
      case 1:
        return (
          <div style={{ marginTop: '20px' }}>
            <TermsOfService />
            <div style={{ marginTop: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={handleAgreement}
                />
                <Typography variant="body2" style={{ display: 'inline', marginLeft: '8px' }}>
                  I Understand
                </Typography>
              </label>
              <Typography variant="body1" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                {user ? 'Please agree to the terms and conditions to proceed.' : 'Please log in to proceed.'}
              </Typography>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              This is the payment step where users can complete their payment.
            </Typography>
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{
                  backgroundColor: '#f1f1f1',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
                disabled={discountedPrice !== null}
              />
              <Button variant="contained" onClick={applyCoupon} style={{ backgroundColor: '#001d3d' }} disabled={discountedPrice !== null}>
                Apply
              </Button>
              {discountedPrice !== null && (
                <Typography
                  variant="body2"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'green',
                    pointerEvents: 'none',
                    opacity: 0.8
                  }}
                >
                  Coupon Applied
                </Typography>
              )}
            </div>
            {couponError && (
              <Typography variant="body2" color="error" style={{ marginBottom: '10px' }}>
                {couponError}
              </Typography>
            )}
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              <strong>Original Price:</strong> ₹{courseData?.salePrice}
            </Typography>
            {discountedPrice !== null && (
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                <strong>Discounted Price:</strong> ₹{discountedPrice}
              </Typography>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkout-page" style={{ backgroundColor: '#001d3d', color: '#333333', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Stepper and Details */}
        <div style={{ flex: '1 1 100%', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f1faee', width: '100%' }}>
          <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#001d3d' }}>
            Checkout Page
          </Typography>
          <Typography variant="h5" style={{ marginBottom: '20px', color: '#001d3d', textAlign: 'center' }}>Checkout Steps</Typography>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel style={{ width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body1">{label}</Typography>
                    <Typography variant="caption">Step {index + 1}</Typography>
                  </div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Render detailed content for the active step */}
          <div style={{ marginTop: '20px' }}>
            {renderStepContent(activeStep)}
          </div>

            {/* Navigation Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Button disabled={activeStep === 0 || (activeStep === 1 && (!user || !agreed))} onClick={handleBack} variant="outlined" style={{ color: '#001d3d', borderColor: '#001d3d' }}>Back</Button>
            <Button
              disabled={!user || (activeStep === 1 && !agreed)} // Disable if not agreed in step 1
              variant="contained"
              color="primary"
              onClick={handleNext}
              style={{
                backgroundColor: !user || (activeStep === 1 && !agreed) ? '#ddd' : '#001d3d',
                cursor: !user || (activeStep === 1 && !agreed) ? 'not-allowed' : 'pointer'
              }}
            >
              {activeStep === steps.length - 1 ? 'Pay Now' : 'Next'}
            </Button>
          </div>
        </div>


        {/* Course and Student Details */}
        {courseData && (
          <div style={{ flex: '1 1 100%', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f4f3ee', width: '100%', marginTop: '20px' }}>
            <Typography variant="h5" style={{ marginBottom: '20px', color: '#000814', textAlign: 'center' }}>Course Details</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <Image
                src={courseData.thumbnail}
                alt="Course Logo"
                width={402} height={102}
                style={{ marginBottom: '10px', borderRadius: '5%' }}
              />
              <div>
                <Typography variant="subtitle1" style={{ marginBottom: '5px', textAlign: 'center' }}>
                  <strong>Title:</strong> {courseData.name}
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '5px', textAlign: 'center' }}>
                  <strong>Instructor:</strong> Rishab Chauhan
                </Typography>
                <Typography variant="body1" style={{ marginBottom: '10px', textAlign: 'center' }}>
                  <strong>Description:</strong> {courseData.description}
                </Typography>
              </div>
            </div>
          </div>
        )}

        {userData && (
          <div className="pb-[calc(60px+1rem)]">
          <div style={{ flex: '1 1 100%', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f4f3ee', width: '100%', marginTop: '20px'}}>
            <Typography variant="h5" style={{ marginBottom: '20px', color: '#000814', textAlign: 'center' }}>Student Details</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
              <Image src={Avatar} alt="Student Avatar" width={102} height={52} style={{ marginBottom: '10px', borderRadius: '5%' }} />
              <div >
                <Typography variant="subtitle1" style={{ marginBottom: '5px', textAlign: 'center' }}>
                  <strong>Student Name:</strong> {userData.name}
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '5px', textAlign: 'center' }}>
                  <strong>Student Email:</strong> {userData.email}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: '10px', textAlign: 'center' }}>
                  <strong>Student SUID:</strong> {userData.suid}
                </Typography>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Loader */}
      {loading && (
        <div
          style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1000' }}
        >
          <div
            style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}
          >
            <Typography
              variant="h6"
              style={{ marginBottom: '10px' }}
            >
              Generating Invoice...
            </Typography>
            <div className="loader"></div>
          </div>
        </div>
      )}

      

      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default PhoneCheckoutPage;