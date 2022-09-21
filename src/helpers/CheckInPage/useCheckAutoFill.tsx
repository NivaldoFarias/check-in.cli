import { MutableRefObject, useEffect } from "react";

import useCheckInReducer from "../../hooks/useCheckInReducer";
import { InputRef } from "../../pages/auth/check-in";

export function useCheckAutoFill(inputRef: MutableRefObject<InputRef>) {
  const { state, dispatch } = useCheckInReducer();
  const { cpf, password } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current?.cpf &&
        !!inputRef.current?.cpf.value.length &&
        inputRef.current?.cpf?.matches(":-internal-autofill-selected") &&
        !cpf.hasAutoFilled
      ) {
        dispatch({
          type: "forms",
          key: "cpf",
          field: "hasAutoFilled",
          payload: true,
        });
      }

      if (
        inputRef.current?.password &&
        !!inputRef.current?.password.value.length &&
        inputRef.current?.password?.matches(":-internal-autofill-selected") &&
        !password.hasAutoFilled
      ) {
        dispatch({
          type: "forms",
          key: "password",
          field: "hasAutoFilled",
          payload: true,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 100);

    if (cpf.hasAutoFilled && password.hasAutoFilled) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpf.hasAutoFilled, password.hasAutoFilled]);
}
