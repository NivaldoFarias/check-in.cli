export interface InitialState {
  cpf: {
    value: string;
    hasAutoFilled: boolean;
    isValid: boolean;
  };
  password: {
    value: string;
    hasAutoFilled: boolean;
  };
  hasSubmitted: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FormsAction {
  type: 'forms';
  key: 'cpf' | 'password';
  field: 'value' | 'hasAutoFilled' | 'isValid';
  payload: string | boolean;
}

export interface BooleanAction {
  type: 'boolean';
  key: 'isLoading' | 'hasSubmitted';
  payload: boolean;
}

export interface ErrorAction {
  type: 'error';
  payload: string;
}

export interface ResetAction {
  type: 'reset';
  key: 'cpf' | 'password';
}

export type CheckInReducerAction =
  | BooleanAction
  | FormsAction
  | ErrorAction
  | ResetAction;
