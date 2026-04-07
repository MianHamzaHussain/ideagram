import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Edit2 } from 'react-feather';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import BottomSheet from '../../components/BottomSheet/BottomSheet';
import { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api/auth';
import { useMutation } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader/PageHeader';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import PasswordChangeSheet from './PasswordChangeSheet';
import CameraCaptureModal from '../../components/CameraCaptureModal/CameraCaptureModal';
import { useMediaManager } from '../../hooks/useMediaManager';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  bio: Yup.string(),
  phone: Yup.string(),
  division: Yup.string().required('Division is required'),
  subdivision: Yup.string().required('Subdivision is required'),
});

const DIVISIONS = {
  'Manufacturing': ['Assembly', 'Quality Control'],
  'Sales': ['Direct Sales', 'Support'],
  'Engineering': ['Frontend', 'Backend'],
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const logout = useAuthStore((state) => state.logout);

  const { isCameraOpen, setIsCameraOpen, handleCapture, processFiles } = useMediaManager((item) => {
    setTempPhoto(item.dataUrl);
    setIsPreviewOpen(true);
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
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

  return (
    <div className="flex flex-col bg-white h-full">
      <Formik
        initialValues={{
          name: '',
          bio: '',
          phone: '',
          division: '',
          subdivision: ''
        }}
        validationSchema={ProfileSchema}
        onSubmit={(values) => {
          console.log('Update profile:', values);
          setInitialPhoto(currentPhoto);
        }}
      >
        {({ values, setFieldValue, setFieldTouched, dirty, isValid, submitForm }) => (
          <>
            <PageHeader
              title="Profile"
              onBack={() => handleBack(dirty)}
              centered={true}
              showBorder={false}
              rightElement={
                <button
                  type="button"
                  onClick={() => submitForm()}
                  disabled={!dirty || !isValid}
                  className={`font-inter font-bold text-[16px] pr-2 transition-colors ${dirty && isValid ? 'text-brand-blue' : 'text-neutral-400 opacity-50 cursor-not-allowed'
                    }`}
                >
                  Save
                </button>
              }
            />

            <div className="flex-1 px-[10px] pb-10 overflow-y-auto">
              <div className="flex flex-col items-center mb-8 mt-6">
                <div className="relative w-[126px] h-[126px]">
                  <div className="w-full h-full bg-primary-100/30 rounded-full flex items-center justify-center overflow-hidden">
                    {currentPhoto ? (
                      <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[32px] font-bold text-neutral-900">JC</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="absolute bottom-0 right-1 w-8 h-8 bg-neutral-50 border-2 border-white rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors z-10 shadow-sm"
                  >
                    {currentPhoto ? <Edit2 size={14} className="text-neutral-900" /> : <Plus size={16} className="text-neutral-900" />}
                  </button>
                </div>
              </div>

              <Form className="flex flex-col gap-5">
                <TextField label="Name" name="name" placeholder="Name" />
                <TextField label="Bio" name="bio" placeholder="Add a short bio" />
                <TextField label="Phone Number" name="phone" placeholder="Enter your phone number" />

                <div className="flex flex-col gap-2">
                  <label className="label-m">Division</label>
                  <div className="relative">
                    <select
                      name="division"
                      className="input-field appearance-none"
                      value={values.division}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue('division', val);
                        setFieldValue('subdivision', '');
                      }}
                      onBlur={() => setFieldTouched('division', true)}
                    >
                      <option value="">Select division</option>
                      {Object.keys(DIVISIONS).map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label-m">Subdivision</label>
                  <div className="relative">
                    <select
                      name="subdivision"
                      className="input-field appearance-none"
                      value={values.subdivision}
                      onChange={(e) => setFieldValue('subdivision', e.target.value)}
                      onBlur={() => setFieldTouched('subdivision', true)}
                      disabled={!values.division}
                    >
                      <option value="">Select subdivision</option>
                      {values.division && DIVISIONS[values.division as keyof typeof DIVISIONS]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

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
              <button className="py-4 text-left font-inter font-medium text-[16px]" onClick={() => { setIsPhotoModalOpen(false); setIsCameraOpen(true); }}>Take Photo</button>
              <button className="py-4 text-left font-inter font-medium text-[16px]" onClick={() => { setIsPhotoModalOpen(false); fileInputRef.current?.click(); }}>Choose From Library</button>
            </>
          ) : (
            <>
              <button className="py-4 text-left font-inter font-medium text-[16px]" onClick={() => { setIsPhotoModalOpen(false); setIsCameraOpen(true); }}>Change Photo</button>
              <button className="py-4 text-left font-inter font-medium text-[16px]" onClick={() => { setIsPhotoModalOpen(false); fileInputRef.current?.click(); }}>Choose From Gallery</button>
              <button className="py-4 text-left font-inter font-medium text-[16px] text-brand-red" onClick={() => { setCurrentPhoto(null); setIsPhotoModalOpen(false); }}>Remove Photo</button>
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
  );
};

export default ProfilePage;
