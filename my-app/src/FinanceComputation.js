
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

export default function BasicDateRangeCalendar() { //calender to select time range to show graphs
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar']}>
        <DateRangeCalendar />
      </DemoContainer>
    </LocalizationProvider>
  );
}


//old code for something else
// function Algorithm({ income, spendings }) {
//     const sum = income - spendings;

//     return (
//         <div>
//             <h2>Income and Spendings</h2>
//             <p>Income: ${income}</p>
//             <p>Spendings: ${spendings}</p>
//             <p>Remaining: ${sum}</p>
//         </div>
//     );
// }



