import { Camera, Image } from 'react-feather';

interface MediaButtonProps {
  type: 'camera' | 'photos';
  onClick: () => void;
}

const MediaButton = ({ type, onClick }: MediaButtonProps) => {
  const isCamera = type === 'camera';
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center w-[112px] h-[112px] rounded-2xl border-2 border-dashed border-[#D5D5D5] bg-white hover:bg-neutral-50 transition-colors focus:outline-none"
    >
      <div className="text-brand-blue mb-2">
        {isCamera ? (
          <div className="relative">
            <Camera size={32} />
            <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
               <span className="block w-3 h-3 bg-brand-blue rounded-full flex items-center justify-center text-white text-[8px] font-bold">+</span>
            </span>
          </div>
        ) : (
          <div className="relative">
            <Image size={32} />
            <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
               <span className="block w-3 h-3 bg-brand-blue rounded-full flex items-center justify-center text-white text-[8px] font-bold">+</span>
            </span>
          </div>
        )}
      </div>
      <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[1.4] text-[#1F2122]">
        {isCamera ? 'Camera' : 'Add Photos'}
      </span>
    </button>
  );
};

export default MediaButton;
