/* eslint-disable no-tabs */

import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

type ProfileProps = {
  fullName: string;
  email: string;
  birthday: string;
  setFullName: any;
  setEmail: any;
  setBirthday: any;
  setIsEdit: any;
};
export default function InputList(props: ProfileProps) {
  const { fullName, email, birthday, setFullName, setEmail, setBirthday, setIsEdit } = props;
  const handleChange = (value: any, method: any) => {
    if (value) {
      setIsEdit(true);
      method(value);
    }
  };
  return (
    <div className='w-full'>
      <div className='flex flex-row p-1'>
        <PersonOutlinedIcon fontSize='large' />
        <TextField
          id='fullName'
          label='Full Name'
          value={fullName}
          fullWidth
          onChange={(e) => handleChange(e.target.value, setFullName)}
        />
      </div>
      <div className='flex w-full  flex-row justify-between'>
        <div className='flex w-6/12 flex-row  p-1'>
          <DateRangeIcon fontSize='large' />
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Birthday'
                value={dayjs(birthday)}
                onChange={(value) => handleChange(value?.toDate().toString(), setBirthday)}
                disableFuture
                views={['year', 'month', 'day']}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className='flex w-full flex-row  p-1'>
          <AlternateEmailOutlinedIcon fontSize='large' />
          <TextField
            id='email'
            label='Email'
            value={email}
            fullWidth
            onChange={(e) => handleChange(e.target.value, setEmail)}
          />
        </div>
      </div>
    </div>
  );
}
