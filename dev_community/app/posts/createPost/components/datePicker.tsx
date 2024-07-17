import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './dateTimePicker.css';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';

interface DatePickerProps {
  scheduleDate?: string | null;
  getDate: (date: string|null) => void;
}
const disabledDate = (current: dayjs.Dayjs) => {
  // Can not select days before today
  return current && current.isBefore(dayjs(), 'day');
};
const DatePickerPage: React.FC<DatePickerProps> = ({ getDate, scheduleDate }) => {
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      getDate(date.format(dateFormat));
    } else {
      getDate(null);
    }
  };

  return (
    <DatePicker
      // defaultValue={dayjs()} // Changed this line
      format={dateFormat}
      onChange={handleDateChange}
      disabledDate={disabledDate} // Add this line
      value={scheduleDate ? dayjs(scheduleDate, dateFormat) : undefined}
    />
  );
};

export default DatePickerPage;