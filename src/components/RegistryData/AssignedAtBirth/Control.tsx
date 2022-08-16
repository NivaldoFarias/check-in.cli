import { components, ControlProps } from 'react-select';
import { MouseEvent, useContext } from 'react';

import DataContext from '../../../contexts/DataContext';

function Control(props: ControlProps) {
  const { children } = props;

  const { selectAssigned, setSelectAssigned } = useContext(DataContext);

  return (
    <div onClick={handleClick}>
      <components.Control {...props}>{children}</components.Control>
    </div>
  );

  function handleClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSelectAssigned(!selectAssigned);
  }
}

export default Control;
