import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '../../components/TextField/TextField';
import BottomSheet from '../../components/BottomSheet/BottomSheet';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorUtils';

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword1: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  newPassword2: Yup.string()
    .oneOf([Yup.ref('newPassword1')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface PasswordChangeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordChangeSheet = ({ isOpen, onClose }: PasswordChangeSheetProps) => {
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) => {
      toast.success(data?.detail || 'Password changed successfully!');
      onClose();
    },
    onError: (error: any) => {
      const msg = getErrorMessage(error, 'Failed to change password');
      toast.error(msg);
    }
  });

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Formik
        initialValues={{ currentPassword: '', newPassword1: '', newPassword2: '' }}
        validationSchema={ChangePasswordSchema}
        onSubmit={(values) => {
          console.log('PasswordChangeSheet: Submitting form', values);
          changePasswordMutation.mutate({
            oldPassword: values.currentPassword,
            newPassword1: values.newPassword1,
            newPassword2: values.newPassword2,
          });
        }}
      >
        {({ dirty, isValid, handleSubmit, errors }) => (
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="flex flex-col bg-white"
          >
            <PageHeader
              title="Change Password"
              showHandle={true}
              showBack={false}
              sticky={false}
              showBorder={false}
              leftElement={
                <button
                  type="button"
                  onClick={onClose}
                  className="font-inter font-semibold text-[16px] leading-[1.4] text-[#414346] px-2 text-center"
                >
                  Cancel
                </button>
              }
              rightElement={
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  onClick={() => {
                    console.log('Save button clicked manually');
                    if (!isValid) {
                      const firstError = Object.values(errors)[0];
                      if (firstError) {
                        toast.warning(firstError as string);
                      } else {
                        toast.warning("Please check the form for errors");
                      }
                    }
                  }}
                  className={`font-inter font-bold text-[16px] leading-[24px] pr-2 transition-colors ${dirty && isValid ? 'text-brand-blue' : 'text-neutral-400 opacity-50'
                    }`}
                >
                  {changePasswordMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              }
              className="px-0 pt-0" // Reset for inset layout
            />

            {/* Form Content */}
            <div className="px-6 pt-6 pb-12 flex flex-col gap-6 overflow-y-auto">
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
              />
              <TextField
                label="New Password"
                name="newPassword1"
                type="password"
                placeholder="Enter new password"
              />
              <TextField
                label="Confirm New Password"
                name="newPassword2"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
          </form>
        )}
      </Formik>
    </BottomSheet>
  );
};

export default PasswordChangeSheet;
