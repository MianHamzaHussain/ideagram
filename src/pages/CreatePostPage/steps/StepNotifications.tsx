import StepLayout from './StepLayout';
import StepNotificationsContent from './StepNotificationsContent';

const StepNotifications = ({ onNext }: { onNext: () => void }) => {
  return (
    <StepLayout
      title="Notifications"
      onNext={onNext}
      nextLabel="Continue"
    >
      <StepNotificationsContent />
    </StepLayout>
  );
};

export default StepNotifications;
