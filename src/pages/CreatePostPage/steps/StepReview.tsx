import { useFormikContext } from 'formik';
import StepLayout from './StepLayout';
import Button from '../../../components/Button/Button';
import FormError from '../../../components/FormError/FormError';

// Reusable Content Sections
import StepDetailsContent from './StepDetailsContent';
import StepPostDetailsContent from './StepPostDetailsContent';
import StepMediaContent from './StepMediaContent';
import StepNotificationsContent from './StepNotificationsContent';

const StepReview = ({ onNext, error, hasReportId }: { onNext: () => void; error?: string | null; hasReportId?: boolean }) => {
  const { setFieldValue, submitForm, values } = useFormikContext<any>();

  const pendingUploads = values.media?.some((m: any) => !m.uploaded);
  const showRetryText = hasReportId && pendingUploads;

  const CustomFooter = (
    <div className="flex flex-col gap-3 w-full">
      {error && <FormError message={error} className="mb-1" />}
      <div className="flex gap-3 w-full">
        {!hasReportId && (
          <Button 
            type="button" 
            variant="secondary"
            onClick={async () => {
              await setFieldValue('draft', true);
              submitForm();
            }}
            className="flex-1 h-[44px] rounded-[8px] font-bold text-[15px]"
          >
            Save as Draft
          </Button>
        )}
        <Button 
          type="button" 
          onClick={async () => {
            if (!hasReportId) {
              await setFieldValue('draft', false);
            }
            submitForm();
          }}
          className="flex-1 h-[44px] rounded-[8px] font-bold text-[15px]"
        >
          {showRetryText ? 'Retry Uploads' : 'Create Report'}
        </Button>
      </div>
    </div>
  );


  return (
    <StepLayout 
      title="Review and Create the Report" 
      onNext={onNext}
      footer={CustomFooter}
    >
      <div className="flex flex-col pb-10 gap-8">
        
        <StepDetailsContent />

        <StepPostDetailsContent />

        <StepMediaContent />

        <StepNotificationsContent />

      </div>
    </StepLayout>
  );
};

export default StepReview;
