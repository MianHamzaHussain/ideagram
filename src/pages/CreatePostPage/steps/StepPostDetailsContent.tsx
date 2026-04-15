import { useState } from 'react';
import { useFormikContext } from 'formik';
import { TextField, DateTimePicker, BottomSheet } from '@/components';

interface PostDetailsValues {
  title: string;
  description: string;
  date: string;
  time: string;
}

// Format YYYY-MM-DD → "Apr 1, 2026" (Figma-style display)
const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format HH:mm 24h → "05:30 PM" (Figma-style display)
const formatDisplayTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = (h % 12 || 12).toString().padStart(2, '0');
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
};

// Current date as YYYY-MM-DD
const todayDateStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

// Current time as HH:mm
const currentTimeStr = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const StepPostDetailsContent = () => {
  const { values, setFieldValue } = useFormikContext<PostDetailsValues>();
  const [showPicker, setShowPicker] = useState(false);

  const handleDateTimeSelect = (date: string, time: string) => {
    setFieldValue('date', date);
    setFieldValue('time', time);
    setShowPicker(false);
  };

  const hasDateTime = !!(values.date && values.time);

  return (
    <div className="flex flex-col gap-8">
      {/* Title Field */}
      <TextField
        label="Title"
        name="title"
        placeholder="Add a title"
      />

      {/* Description Field */}
      <TextField
        label="Description"
        name="description"
        placeholder="Add a description"
        multiline={true}
        height="150px"
      />

      {/* Completion Date/Time Selection */}
      <div className="flex flex-col gap-2 w-full px-1">
        <label className="font-['Inter',sans-serif] font-bold text-[16px] text-neutral-900">
          Completion Date/Time
        </label>

        {hasDateTime ? (
          <div className="flex gap-2 mt-1">
            {/* Date Pill */}
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="flex items-center justify-center w-fit px-4 h-[34px] bg-[#7676801F] rounded-full font-['Inter',sans-serif] font-normal text-[17px] leading-[22px] tracking-[-0.43px] text-[#000000] hover:bg-[#76768033] transition-colors"
            >
              {formatDisplayDate(values.date)}
            </button>

            {/* Time Pill */}
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="flex items-center justify-center w-fit px-4 h-[34px] bg-[#7676801F] rounded-full font-['Inter',sans-serif] font-normal text-[17px] leading-[22px] tracking-[-0.43px] text-[#000000] hover:bg-[#76768033] transition-colors"
            >
              {formatDisplayTime(values.time)}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="w-fit text-[#007AFF] font-['Inter',sans-serif] font-bold text-[16px] hover:underline px-1 mt-1"
          >
            Set Date and Time
          </button>
        )}
      </div>

      {/* Date Time Picker BottomSheet */}
      <BottomSheet isOpen={showPicker} onClose={() => setShowPicker(false)}>
        <DateTimePicker
          onClose={() => setShowPicker(false)}
          onSelect={handleDateTimeSelect}
          initialDate={values.date || todayDateStr()}
          initialTime={values.time || currentTimeStr()}
        />
      </BottomSheet>
    </div>
  );
};

export default StepPostDetailsContent;
