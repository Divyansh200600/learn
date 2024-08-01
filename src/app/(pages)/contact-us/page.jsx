'use client'
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import { FaLinkedin, FaInstagram, FaBehance } from 'react-icons/fa';
import { db } from '../../../utils/Firebase/firebaseConfig'; // Adjust the path according to your project structure
import { collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    interest: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestClick = (interest) => {
    setFormData({
      ...formData,
      interest: interest
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'client'), formData);
      toast.success('Your message has been submitted successfully.');
      setFormData({
        name: '',
        email: '',
        message: '',
        interest: ''
      });
    } catch (error) {
      console.error('Error writing document: ', error);
      toast.error('There was an error submitting your message. Please try again.');
    }
  };

  return (
    <div className="bg-green-100 text-black py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <Typography variant="h3" className="text-3xl sm:text-4xl font-bold mb-8 text-center text-green-800">
          Contact Us
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-800 p-6 rounded-lg">
            <Typography variant="h4" gutterBottom className="text-white mb-4">
              Let's talk on something great together
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Email className="mr-2 text-white" />
              <Typography className="text-white">info@pulsezest.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Phone className="mr-2 text-white" />
              <Typography className="text-white">+91 6396219233, +91 8126663271</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOn className="mr-2 text-white" />
              <Typography className="text-white">Bareilly</Typography>
            </Box>
            <Box mt={2}>
              <IconButton href="https://linkedin.com" target="_blank" className="text-white">
                <FaLinkedin />
              </IconButton>
              <IconButton href="https://behance.net" target="_blank" className="text-white">
                <FaBehance />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" className="text-white">
                <FaInstagram />
              </IconButton>
            </Box>
          </div>
          <div className="bg-white text-black p-6 rounded-lg">
            <Typography variant="h5" gutterBottom className="mb-4">
              I'm interested in:
            </Typography>
            <div className="flex flex-wrap mb-4">
              {['UX/UI design', 'Web design', 'Design system', 'Graphic design', 'Other'].map(option => (
                <Button
                  variant="contained"
                  color="primary"
                  key={option}
                  className="m-1 bg-green-500 hover:bg-green-600"
                  onClick={() => handleInterestClick(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <TextField
              label="Your name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mb-4"
            />
            <TextField
              label="Your email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="mb-4"
            />
            <TextField
              label="Your message"
              variant="outlined"
              fullWidth
              margin="normal"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={4}
              className="mb-4"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="bg-green-500 hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;