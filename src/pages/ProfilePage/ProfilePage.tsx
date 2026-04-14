import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2 } from 'react-feather';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  BottomSheet,
  PageHeader,
  ConfirmModal,
  CameraCaptureModal,
  AnimatedPage,
  PageMeta
} from '@/components';
import { useAuthStore } from '@/store';
import { authApi, userApi, type UserProfileUpdatePayload } from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PasswordChangeSheet from './PasswordChangeSheet';
import { useMediaManager } from '@/hooks';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  bio: Yup.string(),
  phone: Yup.string()
    .nullable()
    .test('phone-validation', 'The phone number entered is not valid. Use 10-11 digits or start with + for international.', (value) => {
      if (!value) return true; // Optional
      const cleanValue = value.replace(/[\s-]/g, ''); // Strip spaces and hyphens
      const usOrLocalFormat = /^\d{10,11}$/; // Allow 10 or 11 digits (US or local PKR etc.)
      const internationalFormat = /^\+\d{7,15}$/; // +521234567890
      return usOrLocalFormat.test(cleanValue) || internationalFormat.test(cleanValue);
    }),
});


const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.fetchProfile(),
    enabled: !!user?.id,
  });



  const { isCameraOpen, setIsCameraOpen, handleCapture, processFiles } = useMediaManager((item) => {
    setTempPhoto(item.dataUrl);
    setIsPreviewOpen(true);
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      // Manually update the query cache instead of re-fetching to improve efficiency
      queryClient.setQueryData(['userProfile'], data);

      const updatedUser = { ...data.user };

      // Cache-busting for profile photo
      if (updatedUser.profile?.profilePhoto) {
        const timestamp = new Date().getTime();
        const photoWithCacheBust = `${updatedUser.profile.profilePhoto}?t=${timestamp}`;

        // Update local state
        setCurrentPhoto(photoWithCacheBust);
        setInitialPhoto(photoWithCacheBust);

        // Update the object we'll send to the store
        updatedUser.profile = {
          ...updatedUser.profile,
          profilePhoto: photoWithCacheBust
        };
      } else {
        setInitialPhoto(currentPhoto);
      }

      // Update global user state (AuthStore)
      updateUser(updatedUser);

      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Update failed:', error);
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      toast.error(getErrorMessage(error, 'Logout failed'));
      logout();
      navigate('/login');
    }
  });

  const handleLogout = () => {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) {
      logoutMutation.mutate(refreshToken);
    } else {
      logout();
      navigate('/login');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSavePhoto = () => {
    setCurrentPhoto(tempPhoto);
    setTempPhoto(null);
    setIsPreviewOpen(false);
  };

  const confirmDiscard = () => {
    setTempPhoto(null);
    setIsDiscardModalOpen(false);
    setIsCameraOpen(false);
    setIsPreviewOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleBack = (isDirty: boolean) => {
    if (isDirty || currentPhoto !== initialPhoto) {
      setPendingAction(() => () => navigate(-1));
      setIsDiscardModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  const u = profile?.user;

  useEffect(() => {
    if (u?.profile?.profilePhoto) {
      setCurrentPhoto(u.profile.profilePhoto);
      setInitialPhoto(u.profile.profilePhoto);
    }
  }, [u?.profile?.profilePhoto]);

  if (isProfileLoading) {
    return (
      <AnimatedPage animationType="push">
        <PageMeta title="Profile" description="View and edit your profile settings." />
        <div className="flex flex-col bg-white h-full overflow-hidden animate-pulse">
          <PageHeader title="Profile" onBack={() => navigate(-1)} centered={true} showBorder={false} />
          <div className="flex-1 px-[10px] pb-10 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col items-center mb-8 mt-6">
              <div className="w-[126px] h-[126px] bg-neutral-100 rounded-full" />
            </div>
            <div className="flex flex-col gap-6 px-4">
              <div className="h-12 bg-neutral-100 rounded-xl w-full" />
              <div className="h-12 bg-neutral-100 rounded-xl w-full" />
              <div className="h-12 bg-neutral-100 rounded-xl w-full" />
              <div className="h-12 bg-neutral-100 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage animationType="push">
      <PageMeta title="Profile" description="View and edit your profile settings." />
      <div className="flex flex-col bg-white h-full overflow-hidden">
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: u ? `${u.firstName} ${u.lastName}`.trim() : '',
            bio: u?.profile?.bio || '',
            phone: u?.phone || '',
          }}
          validationSchema={ProfileSchema}
          onSubmit={async (values, { resetForm }) => {
            const nameParts = values.name.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const payload: UserProfileUpdatePayload = {
              firstName,
              lastName,
              bio: values.bio,
              phone: values.phone,
            };

            // If photo changed and is a base64 string, convert to File
            if (currentPhoto && currentPhoto.startsWith('data:') && currentPhoto !== initialPhoto) {
              try {
                payload.profilePhoto = dataURLtoFile(currentPhoto, 'profile_photo.png');
              } catch (e) {
                console.error('Failed to convert photo:', e);
              }
            }

            updateProfileMutation.mutate(payload, {
              onSuccess: () => {
                resetForm({ values });
              }
            });
          }}
        >
          {({ dirty, isValid, submitForm }) => (
            <>
              <PageHeader
                title="Profile"
                onBack={() => handleBack(dirty)}
                centered={true}
                showBorder={false}
                rightElement={
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    type="button"
                    onClick={() => submitForm()}
                    disabled={(!dirty && currentPhoto === initialPhoto) || !isValid || updateProfileMutation.isPending}
                    className={`font-inter font-bold text-[16px] pr-2 transition-colors focus:outline-none ${((dirty || currentPhoto !== initialPhoto) && isValid && !updateProfileMutation.isPending) ? 'text-brand-blue' : 'text-neutral-400 opacity-50 cursor-not-allowed'
                      }`}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                  </motion.button>
                }
              />

              <div className="flex-1 px-[10px] pb-10 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col items-center mb-8 mt-6">
                  <div className="relative w-[126px] h-[126px]">
                    <div className="w-full h-full bg-primary-100/30 rounded-full flex items-center justify-center overflow-hidden">
                      {currentPhoto ? (
                        <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[32px] font-bold text-neutral-900">
                          {u?.firstName || u?.lastName
                            ? `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase()
                            : u?.email?.charAt(0).toUpperCase() || '??'}
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="absolute bottom-0 right-1 w-8 h-8 bg-neutral-50 border-2 border-white rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors z-10 shadow-sm focus:outline-none"
                    >
                      {currentPhoto ? <Edit2 size={14} className="text-neutral-900" /> : <Plus size={16} className="text-neutral-900" />}
                    </motion.button>
                  </div>
                </div>

                <Form className="flex flex-col gap-5">
                  <TextField label="Name" name="name" placeholder="Name" />
                  <TextField label="Bio" name="bio" placeholder="Add a short bio" />
                  <TextField label="Phone Number" name="phone" placeholder="Enter your phone number" />
                  <TextField label="Division" name="division_display" value={u?.divisionName || 'Not assigned'} disabled={true} />
                  {/* Bio was previously position? User doc said bio is in profile.bio but update takes root bio */}


                  <div className="flex flex-col gap-4 mt-8 px-2">
                    <Button type="button" variant="brand-outline" className="w-full" onClick={() => setIsChangePasswordOpen(true)}>
                      Change Password
                    </Button>
                    <Button
                      type="button"
                      variant="brand-outline"
                      className="w-full"
                      onClick={handleLogout}
                      isLoading={logoutMutation.isPending}
                    >
                      Logout
                    </Button>
                  </div>
                </Form>
              </div>
            </>
          )}
        </Formik>

        <BottomSheet isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)}>
          <div className="flex flex-col px-6 pt-4 pb-8">
            {!currentPhoto ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="py-4 text-left font-inter font-medium text-[16px] focus:outline-none"
                  onClick={() => { setIsPhotoModalOpen(false); setIsCameraOpen(true); }}
                >
                  Take Photo
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="py-4 text-left font-inter font-medium text-[16px] focus:outline-none"
                  onClick={() => { setIsPhotoModalOpen(false); fileInputRef.current?.click(); }}
                >
                  Choose From Library
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="py-4 text-left font-inter font-medium text-[16px] focus:outline-none"
                  onClick={() => { setIsPhotoModalOpen(false); setIsCameraOpen(true); }}
                >
                  Change Photo
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="py-4 text-left font-inter font-medium text-[16px] focus:outline-none"
                  onClick={() => { setIsPhotoModalOpen(false); fileInputRef.current?.click(); }}
                >
                  Choose From Gallery
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="py-4 text-left font-inter font-medium text-[16px] text-brand-red focus:outline-none"
                  onClick={() => { setCurrentPhoto(null); setIsPhotoModalOpen(false); }}
                >
                  Remove Photo
                </motion.button>
              </>
            )}
          </div>
        </BottomSheet>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          accept="image/*"
          className="hidden"
        />

        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapture}
          allowedModes={['photo']}
        />

        {isPreviewOpen && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col max-w-[600px] mx-auto overflow-hidden">
            <PageHeader
              title="Preview"
              onBack={() => setIsPreviewOpen(false)}
              backIcon="close"
              className="bg-black border-none"
              isPWA={true}
            />
            <div className="flex-1 flex items-center justify-center bg-black">
              <img src={tempPhoto!} alt="Captured" className="w-full aspect-square object-cover" />
            </div>
            <footer className="p-8 flex items-center justify-between gap-4 pb-12 bg-black">
              <Button variant="brand-outline" className="flex-1 !border-white !text-white" onClick={() => { setIsPreviewOpen(false); setIsCameraOpen(true); }}>Retake</Button>
              <Button variant="primary" className="flex-1 !h-[40px] !bg-white !text-black" onClick={handleSavePhoto}>Save</Button>
            </footer>
          </div>
        )}

        <ConfirmModal
          isOpen={isDiscardModalOpen}
          onClose={() => setIsDiscardModalOpen(false)}
          onConfirm={confirmDiscard}
          title="Discard Changes"
          message="Are you sure you want to discard your changes? This action cannot be undone."
          confirmText="Discard"
          cancelText="Cancel"
        />

        <PasswordChangeSheet
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProfilePage;
