import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { InputRef } from '../components/CommonData';

type HookProps = {
  inputRef: MutableRefObject<InputRef>;
  hasFirstNameAutoFilled: boolean;
  setSectionState: Dispatch<SetStateAction<boolean>>;
  setHasFirstNameAutoFilled: Dispatch<SetStateAction<boolean>>;
  hasFullNameAutoFilled: boolean;
  setHasFullNameAutoFilled: Dispatch<SetStateAction<boolean>>;
};

export default function useAutoFill(props: HookProps) {
  const {
    inputRef,
    hasFirstNameAutoFilled,
    setSectionState,
    setHasFirstNameAutoFilled,
    hasFullNameAutoFilled,
    setHasFullNameAutoFilled,
  } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current.first_name &&
        inputRef.current?.first_name?.matches(':-internal-autofill-selected') &&
        !hasFirstNameAutoFilled
      ) {
        setSectionState(true);
        setHasFirstNameAutoFilled(true);
      }

      if (
        inputRef.current.full_name &&
        inputRef.current?.full_name?.matches(':-internal-autofill-selected') &&
        !hasFullNameAutoFilled
      ) {
        setSectionState(true);
        setHasFullNameAutoFilled(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (hasFirstNameAutoFilled && hasFullNameAutoFilled) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFirstNameAutoFilled, hasFullNameAutoFilled]);
}
