import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  PropsWithChildren,
  useMemo,
} from "react";
import { signIn, SignInResponse } from "next-auth/react";
import { confirmAlert } from "react-confirm-alert";
import { useRef, createContext } from "react";

import useCheckInReducer from "../../hooks/useCheckInReducer";
import { getRandomInt } from "../../utils/functions.util";
import type { ContextValue } from "../../types/checkIn";
import defaultValue from "./defaultValue";

export type InputRef = {
  [x: string]: HTMLInputElement | null;
};

const CheckInContext = createContext<ContextValue>(
  defaultValue as ContextValue
);

export function CheckInContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const { state, dispatch } = useCheckInReducer();

  const reducerValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  const { cpf, password } = state;
  console.log("provider", cpf.value);

  const inputRef = useRef<InputRef>({
    cpf: null,
    password: null,
  });
  const pageRef = useRef<HTMLDivElement>(null);

  const value = {
    reducers: reducerValue,
    handlers: {
      handleError,
      handleSucess,
      handleSubmit,
      handleCPFInput,
      handleInputBlur,
      handleInputChange,
      handleInputFocus,
      handleSignIn,
    },
    refs: {
      inputRef,
      pageRef,
    },
  };

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );

  function handleError(error: string) {
    let auxMessage = "";
    switch (error) {
      case "NOT_FOUND":
        auxMessage = "não encontramos nenhum cadastro com esse CPF";
        break;
      case "INVALID_CREDENTIALS":
        auxMessage = "a senha está incorreta";
        break;
      default:
        auxMessage = "ocorreu um erro ao tentar fazer o check-in";
    }

    confirmAlert({
      message: `Ops! Parece que ${auxMessage}. Por favor, tente novamente.`,
      buttons: [
        {
          label: "OK",
          onClick: () =>
            dispatch({
              type: "boolean",
              key: "hasSubmitted",
              payload: false,
            }),
        },
      ],
    });
  }

  function handleSucess(_response: SignInResponse) {
    confirmAlert({
      message: `Em breve você será redirecionado para a página inicial!`,
      buttons: [
        {
          label: "OK",
          onClick: () =>
            dispatch({
              type: "boolean",
              key: "hasSubmitted",
              payload: false,
            }),
        },
      ],
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch({ type: "boolean", key: "hasSubmitted", payload: true });
    return setTimeout(handleSignIn, getRandomInt(750, 2000));
  }

  function handleCPFInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    if (value.length === 4 || value.length === 8) {
      dispatch({
        type: "forms",
        key: "cpf",
        field: "value",
        payload:
          value.slice(0, -1) +
          "." +
          (value.slice(-1) === "." ? "" : value.slice(-1)),
      });
    } else if (value.length === 11 && !value.includes(".")) {
      dispatch({
        type: "forms",
        key: "cpf",
        field: "hasAutoFilled",
        payload: true,
      });
      dispatch({
        type: "forms",
        key: "cpf",
        field: "value",
        payload: `
          ${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
          6,
          9
        )}-${value.slice(9)}`,
      });
    } else if (value.length === 12) {
      dispatch({
        type: "forms",
        key: "cpf",
        field: "value",
        payload:
          value.slice(0, -1) +
          "-" +
          (value.slice(-1) === "-" ? "" : value.slice(-1)),
      });
    } else {
      dispatch({
        type: "forms",
        key: "cpf",
        field: "value",
        payload: value,
      });
    }
  }

  function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
    if (e.target.value.length !== 0) return null;

    return inputRef.current[e.target.name]?.classList.remove(
      "input-field--active"
    );
  }

  function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
    return inputRef.current[e.target.name]?.classList.add(
      "input-field--active"
    );
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "forms",
      key: e.target.name as "cpf" | "password",
      field: "value",
      payload: e.target.value,
    });
  }

  async function handleSignIn() {
    try {
      const formattedCpf = cpf.value.replace(/\D/g, "");
      const response: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        cpf: formattedCpf,
        password: password.value,
      });

      if (!response || response.error) {
        return handleError(response?.error ?? "");
      }
      return handleSucess(response);
    } catch (error) {
      console.error(error);
      return handleError("");
    }
  }
}

export default CheckInContext;
