import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

interface DateTimePickerProps {
  onClose: () => void;
  onSelect: (date: string, time: string) => void;
  initialDate?: string; // YYYY-MM-DD
  initialTime?: string; // HH:mm (24h)
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const parseInitialDate = (dateStr?: string): Date => {
  if (dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
};

const parseInitialTime = (timeStr?: string): { hour: string; minute: string; period: 'AM' | 'PM' } => {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();

  if (timeStr) {
    const [hh, mm] = timeStr.split(':').map(Number);
    if (!isNaN(hh) && !isNaN(mm)) {
      h = hh;
      m = mm;
    }
  }

  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return {
    hour: hour12.toString().padStart(2, '0'),
    minute: m.toString().padStart(2, '0'),
    period,
  };
};

/**
 * A fully dynamic Date & Time Picker matching Apple HIG (iOS 17 style).
 * - Defaults to current date/time if no initial values provided.
 * - Respects `initialDate` and `initialTime` when re-opened.
 * - Returns date as YYYY-MM-DD and time as HH:mm (24h) for backend use.
 */
const DateTimePicker = ({ onClose, onSelect, initialDate, initialTime }: DateTimePickerProps) => {
  const initial = parseInitialDate(initialDate);
  const initialTimeValues = parseInitialTime(initialTime);

  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ? initial : null
  );

  const [hour, setHour] = useState(initialTimeValues.hour);
  const [minute, setMinute] = useState(initialTimeValues.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialTimeValues.period);

  // Build the days grid for the current view month
  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate !== null &&
    day === selectedDate.getDate() &&
    viewMonth === selectedDate.getMonth() &&
    viewYear === selectedDate.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') { setHour(''); return; }
    const num = parseInt(val);
    if (num > 12) val = '12';
    if (num === 0) val = '01';
    setHour(val.slice(-2));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') { setMinute(''); return; }
    const num = parseInt(val);
    if (num > 59) val = '59';
    setMinute(val.slice(-2).padStart(2, '0'));
  };

  const handleSave = () => {
    if (!selectedDate) return;

    // Build YYYY-MM-DD for the backend
    const y = selectedDate.getFullYear();
    const mo = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const d = selectedDate.getDate().toString().padStart(2, '0');
    const dateStr = `${y}-${mo}-${d}`;

    // Convert AM/PM → 24h HH:mm for backend
    const h = parseInt(hour || '12');
    const m = minute || '00';
    let h24 = h;
    if (period === 'AM' && h === 12) h24 = 0;
    if (period === 'PM' && h !== 12) h24 = h + 12;
    const timeStr = `${h24.toString().padStart(2, '0')}:${m}`;

    onSelect(dateStr, timeStr);
    onClose();
  };

  return (
    <div className="flex flex-col w-full h-auto p-6 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[19px] text-neutral-900">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <div className="flex gap-2">
          <button
            className="text-[#007AFF] p-1 hover:bg-black/5 rounded-full transition-all"
            type="button"
            onClick={prevMonth}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            className="text-[#007AFF] p-1 hover:bg-black/5 rounded-full transition-all"
            type="button"
            onClick={nextMonth}
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-4">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[11px] font-bold text-neutral-400 text-center tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {calendarCells.map((day, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {day !== null && (
              <button
                type="button"
                onClick={() => setSelectedDate(new Date(viewYear, viewMonth, day))}
                className={`
                  w-[38px] h-[38px] rounded-full flex items-center justify-center font-medium text-[17px] transition-all
                  ${isSelected(day)
                    ? 'bg-[#007AFF] text-white shadow-lg'
                    : isToday(day)
                    ? 'border-2 border-[#007AFF] text-[#007AFF]'
                    : 'text-neutral-900 hover:bg-neutral-100'
                  }
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-neutral-100 w-full my-4" />

      {/* Time Section */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-neutral-900 font-semibold text-[17px]">Time</span>

        <div className="flex items-center gap-3">
          {/* HH:mm Input */}
          <div className="bg-[#7676801F] px-4 py-1.5 rounded-lg flex items-center gap-1 font-bold text-[17px] text-neutral-900 h-[36px]">
            <input
              value={hour}
              onChange={handleHourChange}
              className="w-6 bg-transparent text-center outline-none"
              inputMode="numeric"
            />
            <span>:</span>
            <input
              value={minute}
              onChange={handleMinuteChange}
              className="w-10 bg-transparent text-center outline-none"
              inputMode="numeric"
            />
          </div>

          {/* AM/PM Toggle */}
          <div className="bg-[#7676801F] p-1 rounded-lg flex gap-1 font-bold text-[15px] h-[36px]">
            <button
              type="button"
              onClick={() => setPeriod('AM')}
              className={`px-3 py-0.5 rounded-md transition-all ${period === 'AM' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400'}`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setPeriod('PM')}
              className={`px-3 py-0.5 rounded-md transition-all ${period === 'PM' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400'}`}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={!selectedDate}
        className="w-full h-[54px] bg-[#007AFF] rounded-[14px] font-bold text-[18px] text-white shadow-sm hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center mb-2"
      >
        Set
      </button>
    </div>
  );
};

export default DateTimePicker;
