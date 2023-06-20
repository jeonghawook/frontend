import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import instance from '../api/interceptor';

const SignupPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [signupError, setSignupError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await instance.post('/auth/signup', data);
      console.log(response.data);
      // Handle successful signup
    } catch (error) {
      setSignupError('다시 확인해주세요'); // Display error message
    }
  };

  return (
       <Box
      bg="red.100" // Background color
      p={4} // Padding
      borderRadius="lg" // Rounded corners
      boxShadow="md" // Box shadow
      width="500px"
      margin="auto">
      <VStack spacing={4} align="center" width="500px" maxWidth="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.email} width="100%">
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register('email', { required: true })} />
          <FormErrorMessage>
            {errors.email && 'Email is required.'}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.nickname} width="100%">
          <FormLabel>Nickname</FormLabel>
          <Input type="text" {...register('nickname', { required: true })} />
          <FormErrorMessage>
            {errors.nickname && 'Nickname is required.'}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password} width="100%">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register('password', { required: true })}
          />
          <FormErrorMessage>
            {errors.password && 'Password is required.'}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.confirm} width="100%">
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            {...register('confirm', { required: true })}
          />
          <FormErrorMessage>
            {errors.confirm && 'Please confirm your password.'}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.phoneNumber} width="100%">
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            {...register('phoneNumber', { required: true })}
          />
          <FormErrorMessage>
            {errors.phoneNumber && 'Please enter a valid phone number.'}
          </FormErrorMessage>
        </FormControl>

        <FormControl width="100%">
          <FormLabel>StoreId</FormLabel>
          <Input
            type="tel"
            {...register('storeId')}
            placeholder="Leave empty for null"
          />
          <FormErrorMessage>
            {errors.storeId && 'Please enter a valid store ID.'}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" width="100%">
          Sign Up
        </Button>

        {signupError && (
          <Box color="red" mt={4}>
            {signupError}
          </Box>
        )}
      </form>
    </VStack>
    </Box>
  );
};
export default SignupPage;
