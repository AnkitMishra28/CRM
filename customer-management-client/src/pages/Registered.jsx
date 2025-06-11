import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from "lottie-react";
import animationData from "../assets/register.json";
import { Context } from '../provider/AuthProvider';
import SocialLogin from '../assets/shared/SocialLogin';
import { User, Mail, Lock, Camera, Eye, EyeOff } from 'lucide-react';

let image_hosting_key = import.meta.env.VITE_image_Hosting_key;
let image_hosting_API = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Registered = () => {
  let link = useNavigate();
  let { createRegistered, updateUserProfile } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
  });

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get form data
      let name = e.target.name.value;
      let email = e.target.email.value;
      let img = formData.file;
      let password = e.target.password.value;

      // Password validation regex
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

      if (password.length < 8) {
        toast.error('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
      }

      if (!/[a-z]/.test(password)) {
        toast.error('Password must contain at least one lowercase letter.');
        setIsLoading(false);
        return;
      }

      if (!/[A-Z]/.test(password)) {
        toast.error('Password must contain at least one uppercase letter.');
        setIsLoading(false);
        return;
      }

      if (!/\d/.test(password)) {
        toast.error('Password must contain at least one number.');
        setIsLoading(false);
        return;
      }

      if (!/[!@#$%^&*]/.test(password)) {
        toast.error('Password must contain at least one special character (!, @, #, $, %, ^, &, *).');
        setIsLoading(false);
        return;
      }

      try {
        // First, try to create the user account
        let userCredential;
        try {
          userCredential = await createRegistered(email, password);
        } catch (firebaseError) {
          console.error('Firebase registration error:', firebaseError);
          
          // Handle specific Firebase errors
          if (firebaseError.code === 'auth/email-already-in-use') {
            toast.error('This email is already registered. Please use a different email or try logging in.');
            setIsLoading(false);
            return;
          } else if (firebaseError.code === 'auth/weak-password') {
            toast.error('Password is too weak. Please choose a stronger password.');
            setIsLoading(false);
            return;
          } else if (firebaseError.code === 'auth/invalid-email') {
            toast.error('Invalid email address. Please enter a valid email.');
            setIsLoading(false);
            return;
          } else {
            toast.error('Registration failed. Please try again.');
            setIsLoading(false);
            return;
          }
        }

        let imageFiles = { image: formData.file };

        // Image upload request
        const imageRes = await axios.post(image_hosting_API, imageFiles, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        if (imageRes.data.success) {
          let usersData = {
            name: name,
            email: email,
            user_photo: imageRes.data.data.display_url,
            role: "executives"
          };

          let profileUpdates = {
            displayName: name,
            photoURL: imageRes.data.data.display_url
          };

          // Update user profile
          try {
            await updateUserProfile(userCredential.user, profileUpdates);
            toast.success("Profile Updated Successfully!");

            // Add user to database
            try {
              await axios.post("http://localhost:3000/users", usersData);
              toast.success("Registration successful! Welcome to PerformaSuite CRM.");
            } catch (dbError) {
              console.error('Database error:', dbError);
              // Don't fail registration if database fails, user is already created
              toast.warning("Account created but there was an issue saving additional data.");
            }

            e.target.reset();
            link("/");
          } catch (profileError) {
            console.error('Profile update error:', profileError);
            toast.error('Account created but profile update failed. Please update your profile later.');
            link("/");
          }
        }
      } catch (imageError) {
        console.error('Image upload error:', imageError);
        toast.error('There was an error uploading your image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('General error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-custom-lg shadow-custom-lg">
          {/* Lottie Animation */}
          <div className="flex justify-center items-center">
            <div className="w-60 h-60 md:w-72 md:h-72">
              <Lottie animationData={animationData} loop={true} />
            </div>
          </div>

          {/* Registration Form */}
          <div className="w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join PerformaSuite CRM System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="input"
                />
              </div>

              {/* Profile photo upload */}
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  name="img"
                  required
                  onChange={handleFileChange}
                  className="input file:mr-4 file:py-2 file:px-4 file:rounded-custom file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            {/* Already have an account */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-4">
                <SocialLogin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registered;