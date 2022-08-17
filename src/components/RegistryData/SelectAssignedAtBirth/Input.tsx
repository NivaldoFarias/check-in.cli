import { components, InputProps } from 'react-select';
import { useContext } from 'react';

import DataContext from '../../../contexts/DataContext';

function Input(props: InputProps) {
  const { children } = props;

  const { selectAssigned } = useContext(DataContext);

  return (
    <components.Input autoFocus={selectAssigned} {...props}>
      {children}
    </components.Input>
  );
}

export default Input;
