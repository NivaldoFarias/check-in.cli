import { AiTwotoneCalendar } from 'react-icons/ai';
import { CgRedo, CgPlayForwards, CgPlayTrackNext } from 'react-icons/cg';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import { useState } from 'react';

function BirthdatePicker() {
  const [birthdate, setBirthdate] = useState<Date>();

  const MAX_BIRTHDATE = new Date();
  const MIN_BIRTHDATE = new Date(MAX_BIRTHDATE.getFullYear() - 100, 1, 1);

  return (
    <DatePicker
      locale='pt-br'
      name='birthdate'
      value={birthdate}
      minDate={MIN_BIRTHDATE}
      maxDate={MAX_BIRTHDATE}
      clearIcon={<CgRedo />}
      prevLabel={<CgPlayTrackNext className='nav-icon prev' />}
      prev2Label={<CgPlayForwards className='nav-icon double-prev' />}
      nextLabel={<CgPlayTrackNext className='nav-icon next' />}
      next2Label={<CgPlayForwards className='nav-icon double-next' />}
      calendarIcon={<AiTwotoneCalendar />}
      defaultView={'century'}
      onChange={handleDateChange}
      required
    />
  );

  function handleDateChange(date: Date) {
    setBirthdate(date);
  }
}

export default BirthdatePicker;
