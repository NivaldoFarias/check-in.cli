import { components, DropdownIndicatorProps } from 'react-select';
import { useContext } from 'react';

import DataContext from '../../../contexts/DataContext';

function DropdownIndicator(props: DropdownIndicatorProps) {
  const { children } = props;
  const { selectAssigned } = useContext(DataContext);

  const dropdownStyles = {
    transform: selectAssigned ? 'rotate(180deg)' : 'rotate(0deg)',
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
