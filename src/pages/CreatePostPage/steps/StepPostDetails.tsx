import { useFormikContext } from 'formik';
import StepLayout from './StepLayout';
import StepPostDetailsContent from './StepPostDetailsContent';

interface PostDetailsValues {
  title: string;
  date: string;
  time: string;
}

const StepPostDetails = ({ onNext }: { onNext: () => void }) => {
  const { values } = useFormikContext<PostDetailsValues>();

  const isFormValid = values.title.trim() !== '' && values.date !== '' && values.time !== ''; 

  return (
    <StepLayout 
      title="Enter Post Details" 
      onNext={onNext} 
      isNextDisabled={!isFormValid}
    >
      <StepPostDetailsContent />
    </StepLayout>
  );
};

export default StepPostDetails;
