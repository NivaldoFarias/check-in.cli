import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import { MdFormatClear } from "react-icons/md";
import { AiFillIdcard } from "react-icons/ai";

import backgroundImage from "../../../public/background-alt.svg";
import { checkCpf } from "../../utils/functions.util";
import LoadingDots from "../../components/Loading";

import {
  useLoadPageOpacity,
  useCheckAutoFill,
} from "../../helpers/CheckInPage";
import CheckInContext from "../../contexts/CheckInContext";

export type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function CheckIn() {
  const {
    reducers: { state, dispatch },
    handlers: {
      handleSubmit,
      handleCPFInput,
      handleInputBlur,
      handleInputFocus,
      handleInputChange,
    },
    refs: { inputRef, pageRef },
  } = useContext(CheckInContext);
  const { cpf, password, hasSubmitted } = state;

  useCheckAutoFill(inputRef);

  useLoadPageOpacity(pageRef);

  const checkInForms = buildCheckInForms();

  return (
    <div
      ref={pageRef}
      id="check-in-page"
      className="auth-page"
      onLoad={() => {
        pageRef.current?.classList.add("has-loaded");
      }}
      onLoadCapture={() => pageRef.current?.classList.add("has-loaded")}
    >
      <Image
        className="background-image"
        objectFit="cover"
        src={backgroundImage}
        alt="background image"
        priority={true}
        quality={100}
      />
      {checkInForms}
    </div>
  );

  function buildCheckInForms() {
    const cpfInputClassName = `alert-text cpf-alert ${
      checkCpf(cpf.value) ? "color-transparent" : ""
    }`;
    const cpfRegex = /^[\d\.\-\s]*$/;
    const enableSubmitButton = `submit-btn ${
      cpf.isValid &&
      cpf.value.length === 14 &&
      password.value.length >= 6 &&
      !hasSubmitted
        ? ""
        : "disabled"
    }`;

    const alertCpfText =
      cpf.value.length === 14 ? `CPF inválido` : `Insira apenas números`;

    return (
      <main className="auth-page__container">
        <h1 className="title-card">Check-in</h1>
        <form className="form-group" onSubmit={handleSubmit}>
          <section
            className={`input-section  ${
              cpfRegex.test(cpf.value)
                ? cpf.isValid
                  ? ""
                  : "push-bottom"
                : "push-bottom"
            }`}
          >
            <MdFormatClear
              className={`input-section__reset-icon position-left ${
                cpf.hasAutoFilled ? "" : "hidden"
              }`}
              onClick={() => dispatch({ type: "reset", key: "cpf" })}
            />
            <AiFillIdcard
              className={`input-section__cpf-icon ${
                cpf.hasAutoFilled ? "input-section__cpf-icon--active" : ""
              } ${
                cpf.isValid || cpf.value.length === 0
                  ? ""
                  : "input-section__cpf-icon--invalid"
              }`}
            />
            <input
              type="text"
              name="cpf"
              minLength={14}
              maxLength={14}
              pattern="^[\d\.\-\s]*$"
              value={cpf.value}
              className={`input-field input-spacedout-field ${
                cpf.hasAutoFilled && cpf.value.length > 0
                  ? "input-field--active"
                  : ""
              }`}
              ref={(element) => (inputRef.current["cpf"] = element)}
              onChange={handleCPFInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={cpf.hasAutoFilled && cpf.value.length > 0}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label className="label-text input-spacedout-field">CPF</label>
            <p className={cpfInputClassName}>{alertCpfText}</p>
          </section>
          <section className="input-section">
            <MdFormatClear
              className={`input-section__reset-icon ${
                password.hasAutoFilled ? "" : "hidden"
              }`}
              onClick={() => dispatch({ type: "reset", key: "password" })}
            />
            <input
              type="password"
              name="password"
              maxLength={22}
              value={password.value}
              ref={(element) => (inputRef.current["password"] = element)}
              className={`input-field input-field-password ${
                password.hasAutoFilled && password.value.length > 0
                  ? "input-field--active"
                  : ""
              }`}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={password.hasAutoFilled && password.value.length > 0}
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label className="label-text">Senha</label>
          </section>
          <button className={enableSubmitButton} type="submit">
            {hasSubmitted ? <LoadingDots /> : "Entrar"}
          </button>
          <Link className="register-link" href="/auth/register">
            Ainda não possuo cadastro
          </Link>
        </form>
      </main>
    );
  }
}

export default CheckIn;
