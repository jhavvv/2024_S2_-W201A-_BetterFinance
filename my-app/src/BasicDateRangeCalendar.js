import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import dayjs from 'dayjs';

export default function BasicDateRangeCalendar({ onDateRangeChange }) {
  const [dateRange, setDateRange] = React.useState([null, null]);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
    if (newRange[0] && newRange[1]) {
      // Pass the selected date range to the parent component
      onDateRangeChange([newRange[0].format('YYYY-MM-DD'), newRange[1].format('YYYY-MM-DD')]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar']}>
        <DateRangeCalendar/>
      </DemoContainer>
    </LocalizationProvider>
  );
}
//value={dateRange} onChange={handleDateChange}