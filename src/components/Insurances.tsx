import { useState } from 'react';
import Dropdown from 'react-dropdown';

function Insurance() {
  const [insurance, setInsurance] = useState<string>();
  const options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two', className: 'myOptionClassName' },
    {
      type: 'group',
      name: 'group1',
      items: [
        { value: 'three', label: 'Three', className: 'myOptionClassName' },
        { value: 'four', label: 'Four' },
      ],
    },
    {
      type: 'group',
      name: 'group2',
      items: [
        { value: 'five', label: 'Five' },
        { value: 'six', label: 'Six' },
      ],
    },
  ];

  return (
    <>
      <Dropdown
        options={options}
        onChange={handleChange}
        value={insurance}
        placeholder='Select an option'
      />
    </>
  );

  function handleChange(e: any) {
    e.preventDefault();
    setInsurance(e.target.value);
  }
}

export default Insurance;
