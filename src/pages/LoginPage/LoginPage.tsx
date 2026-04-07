import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';

import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorUtils';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Too short!')
    .required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Successfully logged in!');
      navigate('/');
    },
    onError: (error: any) => {
      const msg = getErrorMessage(error, 'Login Failed');
      toast.error(msg);
    },
  });

  return (
    <div className="flex flex-col items-center w-full px-0 pt-[20.4vh] gap-10 bg-transparent">
      <div className="text-left w-full space-y-4">
        <h1 className="heading-l text-neutral-900 leading-[1.2]">
          Login
        </h1>
      </div>

      <div className="w-full">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            loginMutation.mutate(values);
          }}
        >
          {() => (
            <Form className="flex flex-col gap-6 w-full">
              <TextField
                label="Email address"
                name="email"
                type="email"
                placeholder="Email address"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                placeholder="Password"
              />

              <div className="mt-4">
                <Button type="submit" isLoading={loginMutation.isPending}>
                  Log in
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="flex justify-center w-full mt-8 pb-10">
          <Link to="/forgot-password" className="text-center font-inter font-bold text-[14px] text-primary-300 cursor-pointer no-underline block hover:underline transition-colors tracking-wide">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
