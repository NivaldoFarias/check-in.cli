import { components } from 'react-select';
import { useContext, useEffect } from 'react';

import DataContext from '../../../contexts/DataContext';

function SingleValue(props: any) {
  const { children, data } = props;
  const { registryData, setRegistryData } = useContext(DataContext);

  useEffect(() => {
    if (data && data.label !== registryData.assignedAtBirth) {
      setRegistryData({ ...registryData, assignedAtBirth: data.label });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <components.SingleValue {...props}>{children}</components.SingleValue>;
}

export default SingleValue;
