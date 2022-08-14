import { useState } from 'react';
import Select from 'react-select';

function Insurance() {
  const [insurance, setInsurance] = useState();
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <>
      <Select
        options={options}
        defaultValue={insurance}
        isClearable={true}
        isSearchable={true}
        tabSelectsValue={true}
        backspaceRemovesValue={true}
        placeholder='Select an option'
      />
    </>
  );
}

export default Insurance;
