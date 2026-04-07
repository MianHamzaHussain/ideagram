import { useFormikContext } from 'formik';
import StepLayout from './StepLayout';
import StepDetailsContent from './StepDetailsContent';

interface CreatePostValues {
  project: string;
  reportType: number;
  tags: number[];
}

const StepDetails = ({ onNext }: { onNext: () => void }) => {
  const { values } = useFormikContext<CreatePostValues>();

  const isFormValid = !!(values.project && values.tags.length >= 2);

  return (
    <StepLayout
      title={values.reportType === 1 ? 'Enter Problem Details' : 'Enter Progress Details'}
      onNext={onNext}
      isNextDisabled={!isFormValid}
    >
      <StepDetailsContent />
    </StepLayout>
  );
};

export default StepDetails;
