import StepLayout from './StepLayout';
import StepMediaContent from './StepMediaContent';

const StepMedia = ({ onNext }: { onNext: () => void }) => {
  return (
    <StepLayout 
      title="Add Media" 
      onNext={onNext} 
      isNextDisabled={false}
    >
      <StepMediaContent />
    </StepLayout>
  );
};

export default StepMedia;
