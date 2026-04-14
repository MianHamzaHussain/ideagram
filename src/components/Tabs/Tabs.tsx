import { Check } from 'react-feather';

const WarningIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L21 18H3L12 3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 9V12.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="15.5" r="1.2" fill={color}/>
  </svg>
);

interface TabsProps {
  activeTab: 'progress' | 'trouble';
  onTabChange: (tab: 'progress' | 'trouble') => void;
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex px-4 py-3 bg-white gap-4 z-10">
      <button
        onClick={() => onTabChange('progress')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all duration-200 ${
          activeTab === 'progress'
            ? 'bg-bg-brand-subtlest text-neutral-800 font-semibold shadow-sm'
            : 'text-neutral-400 font-medium'
        }`}
      >
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${activeTab === 'progress' ? 'bg-brand-green' : 'bg-neutral-100 opacity-60'}`}>
          <Check size={14} className="text-white" strokeWidth={4} />
        </div>
        <span className="body-m">Progress</span>
      </button>
      <button
        onClick={() => onTabChange('trouble')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all duration-200 ${
          activeTab === 'trouble'
            ? 'bg-bg-brand-subtlest text-neutral-800 font-semibold shadow-sm'
            : 'text-neutral-400 font-medium'
        }`}
      >
        <div className="flex items-center justify-center w-6 h-6">
          <WarningIcon color={activeTab === 'trouble' ? 'var(--color-brand-orange)' : 'var(--color-neutral-300)'} />
        </div>
        <span className="body-m">Trouble</span>
      </button>
    </div>
  );
};


export default Tabs;
