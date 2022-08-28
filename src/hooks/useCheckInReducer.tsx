import { Dispatch, useReducer } from 'react';

import { CheckInReducerAction, InitialState } from '../types/checkIn';

export const initialState: InitialState = {
  cpf: {
    value: '',
    hasAutoFilled: false,
    isValid: false,
  },
  password: {
    value: '',
    hasAutoFilled: false,
  },
  hasSubmitted: false,
  isLoading: false,
  error: null,
};

export function checkInReducer(
  state: InitialState,
  action: CheckInReducerAction,
) {
  switch (action.type) {
    case 'forms':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          [action.field]: action.payload,
        },
      };
    case 'boolean': {
      return {
        ...state,
        [action.key]: action.payload,
      };
    }
    case 'error': {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'reset': {
      return {
        ...state,
        [action.key]: initialState[action.key],
      };
    }
    default:
      throw new Error(`Unhandled action type`);
  }
}

export default function useCheckInReducer() {
  const [state, dispatch]: [
    state: InitialState,
    dispatch: Dispatch<CheckInReducerAction>,
  ] = useReducer(checkInReducer, initialState);
  return { state, dispatch };
}
