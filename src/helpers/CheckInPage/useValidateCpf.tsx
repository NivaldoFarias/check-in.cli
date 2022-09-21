import { validate } from "gerador-validador-cpf";
import { useMemo } from "react";

import useCheckInReducer from "../../hooks/useCheckInReducer";

export function useValidateCpf() {
  const { state, dispatch } = useCheckInReducer();
  const { cpf } = state;

  useMemo(() => {
    console.log(cpf);
    if (cpf.value.length === 14) {
      dispatch({
        type: "forms",
        key: "cpf",
        field: "isValid",
        payload: validate(cpf.value),
      });
    } else
      dispatch({
        type: "forms",
        key: "cpf",
        field: "isValid",
        payload: true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpf.value]);

  useMemo(() => {
    if (cpf.isValid && cpf.value.length === 14 && !cpf.hasAutoFilled) {
      dispatch({
        type: "forms",
        key: "cpf",
        field: "hasAutoFilled",
        payload: true,
      });
    }
  }, [cpf.isValid]);
}
