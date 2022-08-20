import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { MdFormatClear } from 'react-icons/md';
import { AiFillIdcard } from 'react-icons/ai';
import { validate } from 'gerador-validador-cpf';

import backgroundImage from '../../../public/background-alt.svg';
import { getRandomInt } from '../../utils/functions.util';
import LoadingDots from '../../components/Loading';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function CheckIn() {
  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
  });
  const [validCpf, setValidCpf] = useState<boolean>(true);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hasAutoFilled, setHasAutoFilled] = useState<{ [x: string]: boolean }>({
    cpf: false,
    password: false,
  });

  const inputRef = useRef<InputRef>({
    cpf: null,
    password: null,
  });
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formData?.cpf.length === 14) {
      setValidCpf(validate(formData?.cpf));
    } else setValidCpf(true);
  }, [formData.cpf]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current.cpf &&
        inputRef.current?.cpf?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.cpf
      ) {
        setHasAutoFilled({ ...hasAutoFilled, cpf: true });
      }

      if (
        inputRef.current.password &&
        inputRef.current?.password?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.password
      ) {
        setHasAutoFilled({ ...hasAutoFilled, password: true });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (hasAutoFilled.cpf && hasAutoFilled.password) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [hasAutoFilled]);

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
      validCpf && formData.password?.length > 6 && !hasSubmitted
        ? 'submit-btn'
        : 'submit-btn disabled';

    const alertCpf =
      formData?.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;

    return (
      <main className='auth-page__container'>
        <h1 className='title-card'>Check-in</h1>
        <form className='form-group' onSubmit={handleSubmit}>
          <section
            className={`input-section  ${
              cpfRegex.test(formData?.cpf)
                ? validCpf
                  ? ''
                  : 'push-bottom'
                : 'push-bottom'
            }`}
          >
            <MdFormatClear
              className={`input-section__reset-icon position-left ${
                hasAutoFilled.cpf ? '' : 'hidden'
              }`}
              onClick={() => handleReset('cpf')}
            />
            <AiFillIdcard
              className={`input-section__cpf-icon ${
                hasAutoFilled.cpf ? 'input-section__cpf-icon--active' : ''
              } ${validCpf ? '' : 'input-section__cpf-icon--invalid'}`}
            />
            <input
              type='text'
              name='cpf'
              minLength={14}
              maxLength={14}
              pattern='^[\d\.\-\s]*$'
              value={formData?.cpf}
              className={`input-field input-spacedout-field ${
                hasAutoFilled.cpf && formData.cpf.length > 0
                  ? 'input-field--active'
                  : ''
              }`}
              ref={(element) => (inputRef.current['cpf'] = element)}
              onChange={handleCPFInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={hasAutoFilled.cpf && formData.cpf.length > 0}
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
                hasAutoFilled.password ? '' : 'hidden'
              }`}
              onClick={() => handleReset('password')}
            />
            <input
              type='password'
              name='password'
              maxLength={22}
              value={formData?.password}
              ref={(element) => (inputRef.current['password'] = element)}
              className={`input-field input-field-password ${
                hasAutoFilled.password && formData.password.length > 0
                  ? 'input-field--active'
                  : ''
              }`}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={hasAutoFilled.password && formData?.password.length > 0}
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

    function handleReset(name: 'cpf' | 'password') {
      setFormData({
        ...formData,
        [name]: '',
      });
      setHasAutoFilled({ ...hasAutoFilled, [name]: false });
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      setTimeout(handleSignIn, getRandomInt(750, 2000));
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

    function handleSignIn() {
      signIn('credentials', { redirect: false, password: 'password' });
    }

    function handleCPFInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 4 || value.length === 8) {
        setFormData({
          ...formData,
          cpf:
            value.slice(0, -1) +
            '.' +
            (value.slice(-1) === '.' ? '' : value.slice(-1)),
        });
      } else if (value.length === 12) {
        setFormData({
          ...formData,
          cpf:
            value.slice(0, -1) +
            '-' +
            (value.slice(-1) === '-' ? '' : value.slice(-1)),
        });
      } else {
        setFormData({ ...formData, cpf: value });
      }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function showAlertCpf() {
      const containsOnlyNumbers = cpfRegex.test(formData?.cpf);
      const transparent = containsOnlyNumbers
        ? validCpf
          ? 'color-transparent'
          : ''
        : '';

      return `alert-text cpf-alert ${transparent}`;
    }
  }
}

export default CheckIn;
