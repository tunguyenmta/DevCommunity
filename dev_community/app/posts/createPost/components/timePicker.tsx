'use client';
import React, {useEffect, useState} from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

interface TimePickerProps {
  scheduleTime?: string | null;
  getTime: (time: string | null) => void;
  day: string|null;
}

const TimePickerPage: React.FC<TimePickerProps> = ({ getTime, day , scheduleTime}) => {
 
  useEffect(() => {
    const newTime = scheduleTime ? dayjs(scheduleTime, 'HH:mm:ss') : null;
    if (!time?.isSame(newTime, 'second')) {  // Use 'second' granularity for comparison
      setTime(newTime);
    }
  }, [scheduleTime]); 
  // const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(
    scheduleTime ? dayjs(scheduleTime, 'HH:mm:ss') : null
  );
  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      getTime(time.format('HH:mm:ss'));
      setTime(time);
    } else {
      getTime(null);
      setTime(null);
    }
  };

  useEffect(() => {
    if (day === null) {
      getTime(null);
      setTime(null);
    }
  }, [day]);

  const disabledTime = (current: dayjs.Dayjs | null) => {
    if (!day) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i),
        disabledSeconds: () => Array.from({ length: 60 }, (_, i) => i),
      };
    }
  
    if (day === dayjs().format('YYYY-MM-DD')) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(h => h < currentHour),
        disabledMinutes: (hour: number) => {
          if (hour === currentHour) {
            // Allow selecting minutes that are at least 1 minute greater than the current minute
            return Array.from({ length: 60 }, (_, i) => i).filter(m => m <= currentMinute);
          } else {
            return [];
          }
        },
        disabledSeconds: () => [],
      };
    }
  
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  };
  return (
    <TimePicker
      value={time}
      format="HH:mm:ss"
      onChange={handleTimeChange}
      disabledTime={disabledTime}
      disabled={!day}
    />
  );
};

export default TimePickerPage;