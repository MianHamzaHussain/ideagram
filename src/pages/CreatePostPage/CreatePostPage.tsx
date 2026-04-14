import { useState } from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { PageHeader, StepIndicator, AnimatedPage, PageMeta } from '@/components';
import { useNavigate } from 'react-router-dom';
import { reportApi } from '@/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { getErrorMessage } from '@/utils';

// Steps
import StepType from './steps/StepType';
import StepDetails from './steps/StepDetails';
import StepPostDetails from './steps/StepPostDetails';
import StepMedia from './steps/StepMedia';
import StepNotifications from './steps/StepNotifications';
import StepReview from './steps/StepReview';

export interface MediaItem {
  id: string;
  dataUrl: string;
  type: 'image' | 'video';
  caption: string;
  uploaded?: boolean;
  file?: File;
}

// Validation Schema updated for dynamic fields
const CreatePostSchema = Yup.object().shape({
  reportType: Yup.number().min(1, 'Required').required('Required'),
  project: Yup.string().required('Required'),
  tags: Yup.array().when('reportType', {
    is: 2,
    then: (schema) => schema.min(2, 'Select at least Status and Trend').required('Required'),
    otherwise: (schema) => schema.min(2, 'Select at least two tags').required('Required'),
  }),
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  date: Yup.string().required('Required'),
  time: Yup.string().required('Required'),
  media: Yup.array().of(
    Yup.object().shape({
      caption: Yup.string().required('Caption is required'),
    })
  ),
});

// Helper to convert dataUrl to File
const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

interface InitialValues {
  reportType: number;
  draft: boolean;
  daysToStop: number;
  project: string;
  tags: number[];
  title: string;
  description: string;
  date: string;
  time: string;
  media: MediaItem[];
  mentions: number[];
}

const stepVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '10%' : '-10%',
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-10%' : '10%',
    opacity: 0
  })
};

const CreatePostPage = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalSteps = 6;
  const navigate = useNavigate();

  const [createdReportId, setCreatedReportId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const initialValues: InitialValues = {
    reportType: 0,
    draft: false,
    daysToStop: 0,
    project: '',
    tags: [],
    title: '',
    description: '',
    date: '',
    time: '',
    media: [],
    mentions: [],
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNext = (nextStep: number) => {
    setDirection(1);
    setStep(nextStep);
  };

  const handleSubmit = async (values: InitialValues, { setSubmitting, setFieldValue }: FormikHelpers<InitialValues>) => {
    setFormError(null);
    let reportId = createdReportId;

    try {
      // 1. Metadata Phase (Create or use existing)
      if (!reportId) {
        const reportDate = `${values.date}T${values.time}:00Z`;
        const fullExplanation = values.title
          ? `${values.title.trim()}\n\n${values.description}`
          : values.description;

        const metadata = {
          explanation: fullExplanation,
          reportType: values.reportType,
          notifiedUsers: values.mentions,
          project: parseInt(values.project),
          reportDate,
          tags: values.tags,
          draft: values.draft,
          ...(values.reportType === 1 && values.daysToStop > 0 ? { daysToStop: values.daysToStop } : {}),
        };

        const response = await reportApi.create(metadata);
        reportId = response.id;
        setCreatedReportId(reportId);
      }

      // 2. Parallel Media Upload Phase
      const pendingMedia = values.media.filter(item => !item.uploaded);

      if (pendingMedia.length > 0) {
        const uploadPromises = pendingMedia.map(async (item: MediaItem) => {
          let file: File | undefined;

          if (item.file instanceof File) {
            file = item.file;
          } else if (item.dataUrl && item.dataUrl.startsWith('blob:')) {
            try {
              const response = await fetch(item.dataUrl);
              const blob = await response.blob();
              file = new File([blob], `media_${item.id}.${item.type === 'video' ? 'mp4' : 'jpg'}`, { type: blob.type });
            } catch (err) {
              console.warn('Failed to fetch blob URL, falling back to dataUrl conversion:', err);
            }
          }

          // Fallback if file is still not set
          if (!file && item.dataUrl && item.dataUrl.startsWith('data:')) {
            file = dataUrlToFile(item.dataUrl, `media_${item.id}.${item.type === 'video' ? 'mp4' : 'jpg'}`);
          }

          if (!file) {
            console.error('Critical Error: Media item has no binary file source', item);
            throw new Error(`Media file for "${item.caption || 'item'}" is missing.`);
          }

          await reportApi.uploadMedia(reportId!, {
            file,
            mediaType: item.type,
            caption: item.caption,
          });

          return item.id;
        });


        const results = await Promise.allSettled(uploadPromises);

        let hasFailures = false;
        const currentMedia = [...values.media];

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const uploadedId = result.value;
            const mediaIndex = currentMedia.findIndex(m => m.id === uploadedId);
            if (mediaIndex !== -1) {
              currentMedia[mediaIndex] = { ...currentMedia[mediaIndex], uploaded: true };
            }
          } else {
            hasFailures = true;
          }
        });

        // Always update Formik state to track partial successes
        setFieldValue('media', currentMedia);

        if (hasFailures) {
          throw new Error('Some media files failed to upload. Please try again.');
        }
      }

      // 3. Explicit Publish Phase (Important: Backend creates all reports as drafts)
      if (!values.draft) {
        await reportApi.publish(reportId!);
      }


      // 4. Final Success
      if (values.draft) {
        toast.success('Draft saved successfully!');
      } else {
        toast.success('Report published successfully!');
      }
      navigate('/');
    } catch (error: unknown) {
      console.error('Submission Error:', error);
      const message = getErrorMessage(error, 'Failed to create report. Please try again.');
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage animationType="slide-up">
      <PageMeta title="Create Report" description="Draft and publish a new project progress or trouble report." />
      <div className="relative flex flex-col bg-white h-full overflow-hidden w-full max-w-[600px] mx-auto">
        <div className="flex-none">
          <PageHeader
            title="Create a post"
            variant="creation"
            onBack={handleBack}
            showBorder={false}
          />
          <StepIndicator currentStep={step} totalSteps={totalSteps} />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={CreatePostSchema}
          onSubmit={handleSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <>
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/80 z-[100] flex items-center justify-center flex-col gap-4">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold text-brand-blue">
                    {createdReportId ? 'Uploading Media...' : 'Creating Report...'}
                  </p>
                </div>
              )}
              <Form className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex-1 flex flex-col w-full h-full overflow-hidden"
                  >
                    {step === 0 && (
                      <StepType
                        onSelect={() => {
                          handleNext(1);
                        }}
                      />
                    )}

                    {step === 1 && (
                      <StepDetails
                        onNext={() => handleNext(2)}
                      />
                    )}

                    {step === 2 && (
                      <StepPostDetails
                        onNext={() => handleNext(3)}
                      />
                    )}

                    {step === 3 && (
                      <StepMedia
                        onNext={() => handleNext(4)}
                      />
                    )}

                    {step === 4 && (
                      <StepNotifications
                        onNext={() => handleNext(5)}
                      />
                    )}

                    {step === 5 && (
                      <StepReview
                        error={formError}
                        hasReportId={!!createdReportId}
                        onNext={submitForm}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </AnimatedPage>
  );
};

export default CreatePostPage;
