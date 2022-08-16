import { components, DropdownIndicatorProps } from 'react-select';
import { useContext } from 'react';

import DataContext from '../../../contexts/DataContext';

function DropdownIndicator(props: DropdownIndicatorProps) {
  const { children } = props;
  const { selectGender } = useContext(DataContext);

  const dropdownStyles = {
    transform: selectGender ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  return (
    <div style={dropdownStyles}>
      <components.DropdownIndicator {...props}>
        {children}
      </components.DropdownIndicator>
    </div>
  );
}

export default DropdownIndicator;
