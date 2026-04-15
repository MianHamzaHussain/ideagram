import { useFormikContext } from 'formik';
import { XCircle } from 'react-feather';
import { useSimpleUsers } from '@/hooks';
import { useAuthStore } from '@/store';

interface NotificationValues {
  project: string; // The project ID
  mentions: number[]; // Store numeric IDs
}

const StepNotificationsContent = () => {
  const { values, setFieldValue } = useFormikContext<NotificationValues>();
  const { user } = useAuthStore();
  
  // React Query Hook (Server State)
  const { data: simpleUsers = [], isLoading } = useSimpleUsers(values.project, user?.id);

  const addMention = (idStr: string) => {
    const id = parseInt(idStr);
    if (!isNaN(id) && !values.mentions.includes(id)) {
      setFieldValue('mentions', [...values.mentions, id]);
    }
  };

  const removeMention = (id: number) => {
    setFieldValue('mentions', values.mentions.filter(m => m !== id));
  };

  const currentMentions = values.mentions.map(id => {
    return simpleUsers.find(u => u.id === id);
  }).filter(Boolean);

  return (
    <div className="flex flex-col gap-2 w-full h-[196px]">
      {/* Mentions Label */}
      <label className="font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-[#1F2122] px-1">
        Mentions
      </label>

      {/* Select Field */}
      <div className="relative w-full h-[40px]">
        <select
          value=""
          onChange={(e) => addMention(e.target.value)}
          disabled={isLoading}
          className="w-full h-full bg-white border border-[#D5D5D5] rounded-[8px] px-[8px] font-['Inter',sans-serif] text-[15px] appearance-none cursor-pointer outline-none focus:border-brand-blue disabled:bg-neutral-50"
        >
          <option value="" disabled>{isLoading ? 'Loading users...' : 'Select..'}</option>
          {simpleUsers.filter(u => !values.mentions.includes(u.id)).map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Helper Text */}
      <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[140%] text-[#414346] px-1">
        A notification will be sent to the relevant person.
      </p>

      {/* Chip Group */}
      <div className="flex flex-wrap gap-2 mt-2 min-h-[88px] w-full">
        {currentMentions.map((user) => (
          <div 
            key={user!.id}
            className="flex items-center h-[40px] bg-white border border-[#D5D5D5] rounded-full px-[12px] py-[8px] gap-2 shrink-0 animate-in fade-in zoom-in-95 duration-200"
          >
            <span className="font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-neutral-900 align-middle">
              {user!.name}
            </span>
            <button
              type="button"
              onClick={() => removeMention(user!.id)}
              className="text-[#909090] hover:text-brand-red transition-colors"
              aria-label={`Remove ${user!.name}`}
            >
              <XCircle size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepNotificationsContent;
