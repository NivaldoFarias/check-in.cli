import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useRef, useEffect } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { MdFormatClear } from 'react-icons/md';
import { AiFillIdcard } from 'react-icons/ai';
import { validate } from 'gerador-validador-cpf';

import backgroundImage from '../../../public/background-alt.svg';
import { getRandomInt } from '../../utils/functions.util';
import LoadingDots from '../../components/Loading';
import { confirmAlert } from 'react-confirm-alert';

import useCheckInReducer from '../../hooks/useCheckInReducer';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function CheckIn() {
  const { state, dispatch } = useCheckInReducer();
  const { cpf, password, hasSubmitted } = state;

  const inputRef = useRef<InputRef>({
    cpf: null,
    password: null,
  });
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cpf.value.length === 14) {
      dispatch({
        type: 'forms',
        key: 'cpf',
        field: 'isValid',
        payload: validate(cpf.value),
      });
    } else
      dispatch({
        type: 'forms',
        key: 'cpf',
        field: 'isValid',
        payload: true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpf.value]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current.cpf &&
        !!inputRef.current.cpf.value.length &&
        inputRef.current?.cpf?.matches(':-internal-autofill-selected') &&
        !cpf.hasAutoFilled
      ) {
        dispatch({
          type: 'forms',
          key: 'cpf',
          field: 'hasAutoFilled',
          payload: true,
        });
      }

      if (
        inputRef.current.password &&
        !!inputRef.current.password.value.length &&
        inputRef.current?.password?.matches(':-internal-autofill-selected') &&
        !password.hasAutoFilled
      ) {
        dispatch({
          type: 'forms',
          key: 'password',
          field: 'hasAutoFilled',
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

  useEffect(() => {
    setTimeout(() => {
      if (
        pageRef.current &&
        !pageRef.current.classList.contains('has-loaded')
      ) {
        pageRef.current.classList.add('has-loaded');
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (cpf.isValid && cpf.value.length === 14 && !cpf.hasAutoFilled) {
      dispatch({
        type: 'forms',
        key: 'cpf',
        field: 'hasAutoFilled',
        payload: true,
      });
    }
  }, [cpf.isValid]);

  const checkInForms = buildCheckInForms();

  return (
    <div
      ref={pageRef}
      id='check-in-page'
      className='auth-page'
      onLoad={() => {
        pageRef.current?.classList.add('has-loaded');
      }}
      onLoadCapture={() => pageRef.current?.classList.add('has-loaded')}
    >
      <Image
        className='background-image'
        objectFit='cover'
        src={backgroundImage}
        alt='background image'
        priority={true}
        quality={100}
      />
      {checkInForms}
    </div>
  );

  function buildCheckInForms() {
    const cpfRegex = /^[\d\.\-\s]*$/;
    const validateForm =
      cpf.isValid &&
      cpf.value.length === 14 &&
      password.value.length >= 6 &&
      !hasSubmitted
        ? 'submit-btn'
        : 'submit-btn disabled';

    const alertCpf =
      cpf.value.length === 14 ? `CPF inválido` : `Insira apenas números`;

    return (
      <main className='auth-page__container'>
        <h1 className='title-card'>Check-in</h1>
        <form className='form-group' onSubmit={handleSubmit}>
          <section
            className={`input-section  ${
              cpfRegex.test(cpf.value)
                ? cpf.isValid
                  ? ''
                  : 'push-bottom'
                : 'push-bottom'
            }`}
          >
            <MdFormatClear
              className={`input-section__reset-icon position-left ${
                cpf.hasAutoFilled ? '' : 'hidden'
              }`}
              onClick={() => dispatch({ type: 'reset', key: 'cpf' })}
            />
            <AiFillIdcard
              className={`input-section__cpf-icon ${
                cpf.hasAutoFilled ? 'input-section__cpf-icon--active' : ''
              } ${cpf.isValid ? '' : 'input-section__cpf-icon--invalid'}`}
            />
            <input
              type='text'
              name='cpf'
              minLength={14}
              maxLength={14}
              pattern='^[\d\.\-\s]*$'
              value={cpf.value}
              className={`input-field input-spacedout-field ${
                cpf.hasAutoFilled && cpf.value.length > 0
                  ? 'input-field--active'
                  : ''
              }`}
              ref={(element) => (inputRef.current['cpf'] = element)}
              onChange={handleCPFInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={cpf.hasAutoFilled && cpf.value.length > 0}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label className='label-text input-spacedout-field'>CPF</label>
            <p className={showAlertCpf()}>{alertCpf}</p>
          </section>
          <section className='input-section'>
            <MdFormatClear
              className={`input-section__reset-icon ${
                password.hasAutoFilled ? '' : 'hidden'
              }`}
              onClick={() => dispatch({ type: 'reset', key: 'password' })}
            />
            <input
              type='password'
              name='password'
              maxLength={22}
              value={password.value}
              ref={(element) => (inputRef.current['password'] = element)}
              className={`input-field input-field-password ${
                password.hasAutoFilled && password.value.length > 0
                  ? 'input-field--active'
                  : ''
              }`}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={password.hasAutoFilled && password.value.length > 0}
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label className='label-text'>Senha</label>
          </section>
          <button className={validateForm} type='submit'>
            {hasSubmitted ? <LoadingDots /> : 'Entrar'}
          </button>
          <Link className='register-link' href='/auth/register'>
            Ainda não possuo cadastro
          </Link>
        </form>
      </main>
    );

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      dispatch({ type: 'boolean', key: 'hasSubmitted', payload: true });
      return setTimeout(handleSignIn, getRandomInt(750, 2000));
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--active',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length !== 0) return null;

      return inputRef.current[e.target.name]?.classList.remove(
        'input-field--active',
      );
    }

    async function handleSignIn() {
      try {
        const formattedCpf = cpf.value.replace(/\D/g, '');
        const response: SignInResponse | undefined = await signIn(
          'credentials',
          {
            redirect: false,
            cpf: formattedCpf,
            password: password.value,
          },
        );
        console.log(response);

        if (!response || response.error) {
          return handleError(response?.error ?? '');
        }
        return handleSucess(response);
      } catch (error) {
        console.error(error);
        return handleError('');
      }
    }

    function handleSucess(response: SignInResponse) {
      console.log(response);
      confirmAlert({
        message: `Em breve você será redirecionado para a página inicial!`,
        buttons: [
          {
            label: 'OK',
            onClick: () =>
              dispatch({
                type: 'boolean',
                key: 'hasSubmitted',
                payload: false,
              }),
          },
        ],
      });
    }

    function handleError(error: string) {
      let auxMessage = '';
      switch (error) {
        case 'NOT_FOUND':
          auxMessage = 'não encontramos nenhum cadastro com esse CPF';
          break;
        case 'INVALID_CREDENTIALS':
          auxMessage = 'a senha está incorreta';
          break;
        default:
          auxMessage = 'ocorreu um erro ao tentar fazer o check-in';
      }

      confirmAlert({
        message: `Ops! Parece que ${auxMessage}. Por favor, tente novamente.`,
        buttons: [
          {
            label: 'OK',
            onClick: () =>
              dispatch({
                type: 'boolean',
                key: 'hasSubmitted',
                payload: false,
              }),
          },
        ],
      });
    }

    function handleCPFInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 4 || value.length === 8) {
        dispatch({
          type: 'forms',
          key: 'cpf',
          field: 'value',
          payload:
            value.slice(0, -1) +
            '.' +
            (value.slice(-1) === '.' ? '' : value.slice(-1)),
        });
      } else if (value.length === 11 && !value.includes('.')) {
        dispatch({
          type: 'forms',
          key: 'cpf',
          field: 'hasAutoFilled',
          payload: true,
        });
        dispatch({
          type: 'forms',
          key: 'cpf',
          field: 'value',
          payload: `
            ${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
            6,
            9,
          )}-${value.slice(9)}`,
        });
      } else if (value.length === 12) {
        dispatch({
          type: 'forms',
          key: 'cpf',
          field: 'value',
          payload:
            value.slice(0, -1) +
            '-' +
            (value.slice(-1) === '-' ? '' : value.slice(-1)),
        });
      } else {
        dispatch({
          type: 'forms',
          key: 'cpf',
          field: 'value',
          payload: value,
        });
      }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      dispatch({
        type: 'forms',
        key: e.target.name as 'cpf' | 'password',
        field: 'value',
        payload: e.target.value,
      });
    }

    function showAlertCpf() {
      const containsOnlyNumbers = cpfRegex.test(cpf.value);
      const transparent = containsOnlyNumbers
        ? cpf.isValid
          ? 'color-transparent'
          : ''
        : '';

      return `alert-text cpf-alert ${transparent}`;
    }
  }
}

export default CheckIn;
