import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, PhoneCall } from 'react-feather';
import { CustomChatIcon } from '../Icons/CustomIcons';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import { Link } from 'react-router-dom';
import CarouselIndicators from '../CarouselIndicators/CarouselIndicators';
import StatusPill from '../StatusPill/StatusPill';

interface ReportCardProps {
  id: number;
  title: string;
  project: string;
  shippingStatus: string;
  progressTags: string[];
  tags: string[];
  images: { url: string; caption?: string; type: 'image' | 'video' }[];
  commentsCount: number;
  participantsCount: number;
  description: string;
  timestamp: string;
  postedBy: string;
}

const ReportCard = ({
  id,
  title,
  project,
  shippingStatus,
  tags,
  images,
  commentsCount,
  participantsCount,
  description,
  progressTags,
  timestamp,
  postedBy,
}: ReportCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }}
      className="bg-white w-full mb-4 font-inter overflow-hidden cursor-pointer active:bg-neutral-50/50 transition-colors"
    >
      {/* Header Section - Target 76px Height */}
      <div className="min-h-[76px] px-4 py-3 flex flex-col gap-1 justify-center">
        <h2 className="heading-m truncate w-full text-neutral-900">{title}</h2>
        <div className="flex justify-between items-center w-full">
          <p className="body-s text-neutral-900 truncate pr-4">{project}</p>
          <p className="body-s text-neutral-900 text-right whitespace-nowrap">{shippingStatus}</p>
        </div>
      </div>

      {progressTags.length > 0 && <div className="h-auto  px-4 py-[10px] flex flex-wrap items-center gap-[10px] w-full">
        {progressTags.map((tag) => (
          <StatusPill key={tag} label={tag} />
        ))}
      </div>}

      {/* Image Carousel Section */}
      <div className="mb-4">
        <ImageCarousel images={images} onIndexChange={setActiveIndex} />
      </div>

      {/* Actions Bar */}
      <div className="h-12 w-full flex justify-between items-center px-4 bg-white transition-colors">
        {/* Badges Container */}
        <div className="flex w-[96px] h-12">
          {/* Comments Badge */}
          <div className="flex items-start w-[48px] h-12">
            <div className="w-[48px] h-[48px] p-3 flex items-center justify-center rounded-full transition-colors">
              <CustomChatIcon size={24} className="text-neutral-900" />
            </div>
            {/* Top-aligned count with refined left margin (Exactly 3px gap from icon edge) */}
            <div className="flex flex-col h-9 pt-3 min-w-[8px] -ml-[9px]">
              <span className="text-[12px] font-bold leading-none text-neutral-900">{commentsCount}</span>
            </div>
          </div>
          {/* Participants Badge */}
          <div className="flex items-start w-[48px] h-12">
            <div className="w-[48px] h-[48px] p-3 flex items-center justify-center rounded-full hover:bg-neutral-50 transition-colors cursor-pointer">
              <User size={24} className="text-neutral-900" />
            </div>
            <div className="flex flex-col h-9 pt-3 min-w-[8px] -ml-[9px]">
              <span className="text-[12px] font-bold leading-none text-neutral-900">{participantsCount}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Dot Indicators (Centered) */}
        <CarouselIndicators imagesCount={images.length} activeIndex={activeIndex} />

        {/* Action Button - Call */}
        <button className="w-12 h-12 p-3 flex items-center justify-center rounded-[100px] hover:bg-neutral-50 transition-colors text-neutral-900">
          <PhoneCall size={24} />
        </button>
      </div>

      {/* Details Section */}
      <div className="w-full min-h-auto p-[15px] flex flex-col gap-3 bg-white">
        <div className="w-full min-h-auto max-h-[65px] body-m text-neutral-600 line-clamp-3 overflow-hidden">
          {description}
        </div>

        {tags.length > 0 && <div className="h-auto px-0 py-[10px] flex flex-wrap items-center gap-[10px] w-full">
          {tags.map((tag) => (
            <StatusPill key={tag} label={tag} />
          ))}
        </div>
        }
        <div className="w-full">
          <Link to={`/report/${id}`} className='link-m'> View report details</Link>
        </div>
      </div>
      <div className="w-full mx-auto h-[52px] px-4  flex justify-between items-start ">
        <p className='body-s text-neutral-900'>
          Posted {timestamp}
        </p>
        <p className='body-s text-neutral-900'>
          {postedBy}
        </p>
      </div>
      {/* Divider */}
      <div className="w-[98%] mx-auto h-[1px] bg-neutral-200"></div>
    </motion.div>
  );
};

export default ReportCard;
