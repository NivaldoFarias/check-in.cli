import { Dispatch, useReducer } from "react";

import { CheckInReducerAction, ReducerState } from "../types/checkIn";
import { checkCpf } from "../utils/functions.util";

export const initialState: ReducerState = {
  cpf: {
    value: "",
    hasAutoFilled: false,
    isValid: true,
  },
  password: {
    value: "",
    hasAutoFilled: false,
  },
  hasSubmitted: false,
  isLoading: false,
  error: null,
};

export function checkInReducer(
  state: ReducerState,
  action: CheckInReducerAction
) {
  switch (action.type) {
    case "forms": {
      const { key, field, payload } = action;
      const output = {
        ...state,
        [key]: {
          ...state[key],
          [field]: payload,
        },
      };

      const cpfInput =
        key === "cpf" && field === "value" && typeof payload === "string";
      if (cpfInput) {
        const isValid = checkCpf(payload);
        output.cpf.isValid = isValid;

        const forceInputStyling =
          isValid && payload.length === 14 && !state.cpf.hasAutoFilled;
        if (forceInputStyling) output.cpf.hasAutoFilled = true;

        return output;
      }

      return output;
    }
    case "boolean": {
      const { key, payload } = action;
      return {
        ...state,
        [key]: payload,
      };
    }
    case "error": {
      const { payload } = action;
      return {
        ...state,
        error: payload,
      };
    }
    case "reset": {
      const { key } = action;
      return {
        ...state,
        [key]: initialState[key],
      };
    }
    default:
      throw new Error(`Unhandled action type`);
  }
}

export default function useCheckInReducer() {
  const [state, dispatch]: [
    state: ReducerState,
    dispatch: Dispatch<CheckInReducerAction>
  ] = useReducer(checkInReducer, initialState);
  return { state, dispatch };
}
