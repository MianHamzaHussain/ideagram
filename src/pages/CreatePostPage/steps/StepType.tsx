import { useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import TypeCard from './TypeCard';
import { ProgressIcon, ProblemIcon } from './Icons';
import { ReportType } from '@/api/report';

interface StepTypeProps {
  onSelect: (type: 'progress' | 'problem' | 'drafts') => void;
}

const StepType = ({ onSelect }: StepTypeProps) => {
  const { values, setFieldValue } = useFormikContext<{
    reportType: ReportType;
    draft: boolean;
    tags: number[];
    daysToStop: number;
  }>();
  const navigate = useNavigate();

  const handleSelect = (type: 'progress' | 'problem' | 'drafts') => {
    // Clear tags and daysToStop whenever type is changed to avoid mismatched data
    setFieldValue('tags', []);
    setFieldValue('daysToStop', 0);

    if (type === 'progress') {
      setFieldValue('reportType', ReportType.PROGRESS);
      setFieldValue('draft', false);
    } else if (type === 'problem') {
      setFieldValue('reportType', ReportType.PROBLEM);
      setFieldValue('draft', false);
    } else if (type === 'drafts') {
      setFieldValue('reportType', ReportType.PROBLEM); // Default to problem for draft as requested
      setFieldValue('draft', true);
    }

    // Short delay to show the highlight before moving to next step
    setTimeout(() => {
      onSelect(type);
    }, 200);
  };

  return (
    <div className="flex-1 flex flex-col pt-10 px-4 bg-white min-h-[calc(100vh-100px)]">
      <h1 className="font-['Inter',sans-serif] font-bold text-[25px] leading-[1.2] text-neutral-900 mb-12 px-2">
        What kind of report?
      </h1>

      <div className="flex-1 flex flex-col justify-center gap-4 pb-20">
        <div className="flex gap-[2%] justify-center w-full px-2">
          {/* Progress Card */}
          <div className="w-[49%] min-w-[173px]">
            <TypeCard
              label="Progress"
              icon={<ProgressIcon />}
              onClick={() => handleSelect('progress')}
              isActive={values.reportType === ReportType.PROGRESS && !values.draft}
              activeColor="border-primary-400"
            />
          </div>

          {/* Problem Card */}
          <div className="w-[49%] min-w-[173px]">
            <TypeCard
              label="Problem"
              icon={<ProblemIcon />}
              onClick={() => handleSelect('problem')}
              isActive={values.reportType === ReportType.PROBLEM && !values.draft}
              activeColor="border-primary-400"
            />
          </div>
        </div>

        {/* Drafts Button */}
        <div className="w-full px-2">
          <button
            type="button"
            onClick={() => navigate('/drafts')}
            className="w-full h-[57px] rounded-[16px] px-[40px] py-[16px] border-2 border-dashed border-[#D5D5D5] hover:bg-neutral-50 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span className="font-['Inter',sans-serif] font-bold text-[18px] leading-[1.4] text-[#1F2122]">
              Drafts
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepType;
