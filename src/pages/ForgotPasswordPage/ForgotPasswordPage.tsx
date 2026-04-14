import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, AnimatedPage } from '@/components';
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});


const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage animationType="fade">
      <div className="flex flex-col items-center min-h-screen w-full max-w-[600px] mx-auto px-6 pt-[20.4vh] gap-10 bg-white">
        <div className="text-left w-full space-y-4">
          <h1 className="heading-l text-neutral-900 leading-[1.2]">
            Forgot Password
          </h1>
          <p className="body-m text-neutral-600 leading-[1.60] max-w-[320px]">
            We will reissue your password. Please enter your registered email address.
          </p>
        </div>

        <div className="w-full">
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={() => {
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-6 w-full">
                <TextField
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                />

                <div className="mt-4">
                  <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Send
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="flex justify-center w-full mt-8">
            <button
              onClick={() => navigate('/login')}
              className="text-center text-primary-300 font-bold text-[16px] cursor-pointer no-underline bg-transparent border-none hover:underline transition-colors"
            >
              Return
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ForgotPasswordPage;
