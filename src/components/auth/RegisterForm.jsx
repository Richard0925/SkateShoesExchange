// components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import Button from '../common/Button';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { login } = useAuth();

  // Watch the password and email fields for validation
  const password = watch("password");
  const email = watch("email");

  const footOptions = [
    { value: 'regular', label: 'Regular Stance' },
    { value: 'goofy', label: 'Goofy Stance' },
    { value: 'both', label: 'Both Stances' },
    { value: 'unsure', label: 'Not Sure' }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      console.log('Registration successful:', response);
      setUserEmail(data.email);
      setRegistrationSuccess(true);

      // Call onSuccess callback if provided
      if (typeof onSuccess === 'function') {
        console.log('Calling onSuccess callback');
        onSuccess(response);
      } else {
        console.log('No onSuccess callback provided');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.message.includes('Username is already taken')) {
        setError('username', { type: 'manual', message: 'Username is already taken' });
      } else if (error.message.includes('Email is already registered')) {
        setError('email', { type: 'manual', message: 'Email is already registered' });
      } else {
        setError('root', { type: 'manual', message: error.message || 'Registration failed, please try again later' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-xl font-bold text-green-800 mb-2">Registration Successful!</h3>
        <p className="text-green-700 mb-4">
          We have sent a verification email to <span className="font-semibold">{userEmail}</span>.
        </p>
        <p className="text-green-700 mb-6">
          Please check your inbox and click the verification link to complete your registration.
        </p>
        <div className="text-sm text-gray-600">
          <p>Didn't receive the email? Please check your spam folder or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errors.root.message}
        </div>
      )}

      <FormInput
        id="username"
        label="Username"
        placeholder="Enter username"
        register={register}
        rules={{ required: 'Username is required' }}
        error={errors.username}
      />

      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="your@email.com"
        register={register}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
          }
        }}
        error={errors.email}
      />

      <FormInput
        id="confirmEmail"
        label="Confirm Email"
        type="email"
        placeholder="Confirm your email"
        register={register}
        rules={{
          required: 'Please confirm your email',
          validate: value => value === email || 'Emails do not match'
        }}
        error={errors.confirmEmail}
      />

      <FormInput
        id="password"
        label="Password"
        type="password"
        placeholder="Set password"
        register={register}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        }}
        error={errors.password}
      />

      <FormInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        register={register}
        rules={{
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        }}
        error={errors.confirmPassword}
      />

      <FormSelect
        id="preferredFoot"
        label="Preferred Foot"
        register={register}
        options={footOptions}
        defaultValue="unsure"
        error={errors.preferredFoot}
      />

      <FormInput
        id="shoeSize"
        label="Shoe Size"
        type="number"
        placeholder="Example: 42"
        register={register}
        rules={{
          min: {
            value: 20,
            message: 'Shoe size cannot be less than 20'
          },
          max: {
            value: 50,
            message: 'Shoe size cannot be greater than 50'
          }
        }}
        error={errors.shoeSize}
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Register
      </Button>

      {onSwitchToLogin && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-orange-500 hover:text-orange-600"
          >
            Already have an account? Log in
          </button>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;