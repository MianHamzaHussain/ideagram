import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2 } from 'react-feather';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  BottomSheet,
  PageHeader,
  AnimatedPage,
  PageMeta
} from '@/components';
import { useAuthStore, useModalStore } from '@/store';
import { authApi, userApi, type UserProfileUpdatePayload } from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PasswordChangeSheet from './PasswordChangeSheet';
import { useMediaManager } from '@/hooks';
import { toast } from 'react-toastify';
import { getErrorMessage, dataUrlToFile, getInitials } from '@/utils';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  bio: Yup.string(),
  phone: Yup.string()
    .nullable()
    .test('phone-validation', 'The phone number entered is not valid.', (value) => {
      if (!value) return true;
      const cleanValue = value.replace(/[\s-]/g, '');
      const usOrLocalFormat = /^\d{10,11}$/;
      const internationalFormat = /^\+\d{7,15}$/;
      return usOrLocalFormat.test(cleanValue) || internationalFormat.test(cleanValue);
    }),
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openConfirm } = useModalStore();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [prevProfilePhoto, setPrevProfilePhoto] = useState<string | null>(null);

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.fetchProfile(),
    enabled: !!user?.id,
  });

  const { openCamera: triggerCamera, handleCapture, processFiles } = useMediaManager((item) => {
    setTempPhoto(item.dataUrl);
    setIsPreviewOpen(true);
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
      const updatedUser = { ...data.user };
      if (updatedUser.profile?.profilePhoto) {
        const photoWithCacheBust = `${updatedUser.profile.profilePhoto}?t=${Date.now()}`;
        setCurrentPhoto(photoWithCacheBust);
        setInitialPhoto(photoWithCacheBust);
        updatedUser.profile = { ...updatedUser.profile, profilePhoto: photoWithCacheBust };
      }
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update profile'))
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => { logout(); navigate('/login'); },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Logout failed'));
      logout();
      navigate('/login');
    }
  });

  const handleLogout = () => {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) logoutMutation.mutate(refreshToken);
    else { logout(); navigate('/login'); }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSavePhoto = () => {
    setCurrentPhoto(tempPhoto);
    setTempPhoto(null);
    setIsPreviewOpen(false);
  };

  const confirmDiscard = () => {
    setTempPhoto(null);
    setIsPreviewOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleBack = (isDirty: boolean) => {
    if (isDirty || currentPhoto !== initialPhoto) {
      setPendingAction(() => () => navigate(-1));
      openConfirm({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your changes?',
        confirmText: 'Discard',
        onConfirm: confirmDiscard
      });
    } else {
      navigate(-1);
    }
  };

  const u = profile?.user;
  if (u && u.profile?.profilePhoto !== prevProfilePhoto) {
    setPrevProfilePhoto(u.profile?.profilePhoto || null);
    setCurrentPhoto(u.profile?.profilePhoto || null);
    setInitialPhoto(u.profile?.profilePhoto || null);
  }

  if (isProfileLoading) {
    return (
      <AnimatedPage animationType="push">
        <div className="flex flex-col bg-white h-full animate-pulse">
          <PageHeader title="Profile" onBack={() => navigate(-1)} centered={true} showBorder={false} />
          <div className="flex-1 px-4 py-8 flex flex-col items-center gap-8">
            <div className="w-32 h-32 bg-neutral-100 rounded-full" />
            <div className="w-full space-y-4">
              <div className="h-12 bg-neutral-100 rounded-xl" />
              <div className="h-12 bg-neutral-100 rounded-xl" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage animationType="push">
      <PageMeta title="Profile" />
      <div className="flex flex-col bg-white h-full overflow-hidden">
        <Formik
          enableReinitialize
          initialValues={{
            name: u ? `${u.firstName} ${u.lastName}`.trim() : '',
            bio: u?.profile?.bio || '',
            phone: u?.phone || '',
          }}
          validationSchema={ProfileSchema}
          onSubmit={async (values, { resetForm }) => {
            const nameParts = values.name.trim().split(/\s+/);
            const payload: UserProfileUpdatePayload = {
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              bio: values.bio,
              phone: values.phone,
            };
            if (currentPhoto && currentPhoto.startsWith('data:') && currentPhoto !== initialPhoto) {
              payload.profilePhoto = dataUrlToFile(currentPhoto, 'profile.png');
            }
            updateProfileMutation.mutate(payload, { onSuccess: () => resetForm({ values }) });
          }}
        >
          {({ dirty, isValid, submitForm }) => (
            <>
              <PageHeader
                title="Profile"
                onBack={() => handleBack(dirty)}
                centered
                showBorder={false}
                rightElement={
                  <button
                    onClick={() => submitForm()}
                    disabled={(!dirty && currentPhoto === initialPhoto) || !isValid || updateProfileMutation.isPending}
                    className={`font-bold pr-2 ${((dirty || currentPhoto !== initialPhoto) && isValid) ? 'text-brand-blue' : 'text-neutral-400 opacity-50'}`}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                }
              />

              <div className="flex-1 px-4 pb-10 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col items-center mb-8 mt-6">
                  <div className="relative w-32 h-32">
                    <div className="w-full h-full bg-primary-50 rounded-full overflow-hidden flex items-center justify-center">
                      {currentPhoto ? (
                        <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold">{getInitials(u ? `${u.firstName} ${u.lastName}` : '')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center border border-neutral-200"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>

                <Form className="flex flex-col gap-5">
                  <TextField label="Name" name="name" />
                  <TextField label="Bio" name="bio" />
                  <TextField label="Phone Number" name="phone" />
                  <div className="flex flex-col gap-3 mt-8">
                    <Button type="button" variant="brand-outline" onClick={() => navigate('/drafts')}>My Drafts</Button>
                    <Button type="button" variant="brand-outline" onClick={() => setIsChangePasswordOpen(true)}>Change Password</Button>
                    <Button type="button" variant="brand-outline" onClick={handleLogout} isLoading={logoutMutation.isPending}>Logout</Button>
                  </div>
                </Form>
              </div>
            </>
          )}
        </Formik>

        <BottomSheet isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)}>
          <div className="flex flex-col px-6 py-4">
            <button className="py-4 text-left font-medium" onClick={() => { setIsPhotoModalOpen(false); triggerCamera({ onCapture: handleCapture, allowedModes: ['photo'] }); }}>Take Photo</button>
            <button className="py-4 text-left font-medium" onClick={() => { setIsPhotoModalOpen(false); fileInputRef.current?.click(); }}>Choose from Library</button>
            {currentPhoto && <button className="py-4 text-left font-medium text-brand-red" onClick={() => { setCurrentPhoto(null); setIsPhotoModalOpen(false); }}>Remove Photo</button>}
          </div>
        </BottomSheet>

        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && processFiles(e.target.files)} accept="image/*" className="hidden" />

        {isPreviewOpen && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col">
            <PageHeader title="Preview" onBack={() => setIsPreviewOpen(false)} backIcon="close" className="bg-black text-white" />
            <div className="flex-1 flex items-center justify-center">
              <img src={tempPhoto!} alt="Preview" className="w-full max-h-full object-contain" />
            </div>
            <footer className="p-8 flex gap-4 bg-black">
              <Button variant="brand-outline" className="flex-1 !text-white !border-white" onClick={() => { setIsPreviewOpen(false); triggerCamera({ onCapture: handleCapture, allowedModes: ['photo'] }); }}>Retake</Button>
              <Button variant="primary" className="flex-1 !bg-white !text-black" onClick={handleSavePhoto}>Save</Button>
            </footer>
          </div>
        )}

        <PasswordChangeSheet isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
      </div>
    </AnimatedPage>
  );
};

export default ProfilePage;
