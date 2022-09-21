import type {
    ChangeEvent,
    FocusEvent,
    FormEvent,
    MutableRefObject,
    RefObject,
} from "react";
import type { SignInResponse } from "next-auth/react";

export type ContextValue = {
    reducers: {
        state: ReducerState;
        dispatch: Dispatch<CheckInReducerAction>;
    };
    handlers: {
        handleError(error: string): void;
        handleSucess(_response: SignInResponse): void;
        handleSubmit(e: FormEvent): NodeJS.Timeout;
        handleCPFInput(e: ChangeEvent<HTMLInputElement>): void;
        handleInputBlur(e: FocusEvent<HTMLInputElement>): void | null;
        handleInputFocus(e: FocusEvent<HTMLInputElement>): void | undefined;
        handleInputChange(e: ChangeEvent<HTMLInputElement>): void;
        handleSignIn(): Promise<void>;
    };
    refs: {
        inputRef: MutableRefObject<InputRef>;
        pageRef: RefObject<HTMLDivElement>;
    };
};

export interface ReducerState {
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
    type: "forms";
    key: "cpf" | "password";
    field: "value" | "hasAutoFilled" | "isValid";
    payload: string | boolean;
}

export interface BooleanAction {
    type: "boolean";
    key: "isLoading" | "hasSubmitted";
    payload: boolean;
}

export interface ErrorAction {
    type: "error";
    payload: string;
}

export interface ResetAction {
    type: "reset";
    key: "cpf" | "password";
}

export type CheckInReducerAction =
    | BooleanAction
    | FormsAction
    | ErrorAction
    | ResetAction;
