import React, { useState } from 'react';
import { Button, InputField, Stack, Text, SocialButton, Heading, Alert } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToLanding } from '../actions';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import RedButton from '../../button/RedButton';
import api from '../../../../utils/api';
import 'isomorphic-unfetch'


const HeadingColor = styled.div`
  color: ${colors.donorBackground};
`;


const RegisterDonor = () => {
  const dispatch = useDispatch();
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const handleBackToLandingOnClick = () => {
    dispatch(setIsBackToLanding());
  };

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  }

  const handleFormSubmission = async (values) => {
    try {
      const [token, user, userDoc] = await api.auth.registerDonorWithEmailAndPassword(values.email, values.password);
      console.log(token);
      await api.auth.sendVerificationEmail();
      displayAlert('Successfully Registered!', `A verification email has been sent to ${user.email}`, 'success' )
    } catch (error) {
      console.log(error)
      displayAlert('Error', error.message, 'critical')
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const [token, user, userDoc] = await api.auth.registerDonorWithGoogle();
      console.log(token);
      await api.auth.sendVerificationEmail();
      displayAlert('Successfully Registered!', `A verification email has been sent to ${user.email}`, 'success' )
    } catch (error) {
      console.log(error);
      displayAlert('Error', error.message, 'critical')
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required'),
    password: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Please create a password with at least 12 characters, comprimising a mix of uppercase and lowercase letters, numbers and symbols'
      ),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  return (
    <div>
      <Button
        type="secondary"
        circled
        iconLeft={<ChevronLeft />}
        onClick={handleBackToLandingOnClick}
        spaceAfter="normal"
      />
      <Text align="center" as="div" spaceAfter="largest">
        <Stack direction="row" align="center" justify="center">
          <Heading size="large" weight="bold">
            I am a
          </Heading>
          <Heading size="large" weight="bold">
            <HeadingColor>Donor</HeadingColor>
          </Heading>
        </Stack>
      </Text>
      <SocialButton type="google" fullWidth={true} spaceAfter="normal" onClick={handleGoogleRegister}>
        Sign in with Google
      </SocialButton>
      <Text align="center" spaceAfter="normal">
        OR
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="comfy" spaceAfter="normal">
          <InputField
            disabled={formik.isSubmitting}
            type="email"
            value="name@example.co"
            label="Email"
            name="email"
            placeholder="e.g. name@email.com"
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            {...formik.getFieldProps('email')}
          />

          <InputField
            disabled={formik.isSubmitting}
            type="password"
            label="Create a password"
            name="password"
            spaceAfter={'normal'}
            help="Please create a password with at least 12 characters, comprimising a mix of uppercase and lowercase letters, numbers and symbols"
            error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            {...formik.getFieldProps('password')}
          />

          <InputField
            disabled={formik.isSubmitting}
            type="password"
            label="Confirm password"
            name="passwordConfirm"
            error={
              formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                ? formik.errors.passwordConfirmation
                : ''
            }
            {...formik.getFieldProps('passwordConfirmation')}
          />

          <Button submit fullWidth={true} asComponent={RedButton} disabled={formik.isSubmitting}>
            Register
          </Button>
        </Stack>
      </form>

      {showAlert ? (
        <Alert icon title={alertTitle} type={alertType}>
          {alertDescription}
        </Alert>
      ) : null}
    </div>
  );
};

export default RegisterDonor;
