import { ChangeEvent, FocusEvent, FormEvent, useRef } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { validate } from 'gerador-validador-cpf';

import backgroundImage from '../../../public/background-alt.svg';
import { getRandomInt } from '../../utils/functions.util';
import LoadingDots from '../../components/loading';
import Insurance from '../../components/Insurances';
import { time } from '../../utils/constants.util';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function Register() {
  const [formData, setFormData] = useState({
    cpf: '',
    full_name: '',
    social_name: '',
    insurance: '',
    birthdate: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState<Boolean>(false);
  const inputRef = useRef<InputRef>({
    cpf: null,
    full_name: null,
    social_name: null,
    insurance: null,
    birthdate: null,
  });

  const RegisterPage = buildRegisterPage();

  return (
    <div id='register-page' className='auth-page'>
      <Image
        className='background-image'
        objectFit='cover'
        src={backgroundImage}
        alt='background image'
        priority={true}
        quality={100}
      />
      {RegisterPage}
    </div>
  );

  function buildRegisterPage() {
    const validCpf = formData.cpf.length === 14 ? validate(formData.cpf) : true;
    const alertCpf =
      formData.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;
    const alertBirthdate =
      formData.birthdate.length === 10 ? `` : `Insira uma data válida`;

    return (
      <main className='auth-page__container'>
        <h1 className='title-card'>Cadastro</h1>
        <form className='form-group' onSubmit={handleSubmit}>
          <section className='input-section'>
            <input
              type='text'
              maxLength={20}
              name='full_name'
              className='input-field'
              value={formData.full_name}
              ref={(element) => (inputRef.current['full_name'] = element)}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Nome Completo</label>
          </section>
          <section className='input-section'>
            <input
              ref={(element) => (inputRef.current['social_name'] = element)}
              type='text'
              value={formData.social_name}
              name='social_name'
              maxLength={25}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className='input-field'
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Nome Social</label>
          </section>
          <section className='input-section'>
            <input
              ref={(element) => (inputRef.current['insurance'] = element)}
              type='text'
              value={formData.insurance}
              name='insurance'
              maxLength={30}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className='input-field'
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Convênio</label>
          </section>
          <section className='input-section'>
            <input
              type='text'
              name='cpf'
              maxLength={14}
              value={formData.cpf}
              className='input-field input-spacedout-field'
              ref={(element) => (inputRef.current['cpf'] = element)}
              onChange={handleCPFInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>CPF</label>
            <p className={showAlertCpf()}>{alertCpf}</p>
          </section>
          <section className='input-section'>
            <input
              type='date'
              name='birthdate'
              min={time.MIN_DATE}
              max={time.CURRRENT_DATE}
              value={formData.birthdate}
              ref={(element) => (inputRef.current['birthdate'] = element)}
              className='input-field input-field--focused input-spacedout-field input-date-field'
              onChange={handleBirthdateInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Data de nascimento</label>
            <p className={showAlertBirthdate()}>{alertBirthdate}</p>
          </section>
          <section className='input-insurance-section'>
            <p className='input-insurance-section__label'>Convênio</p>
            <Insurance />
          </section>
          <button className={validateForm()} type='submit'>
            {hasSubmitted ? <LoadingDots /> : 'Cadastrar'}
          </button>
          <Link className='register-link' href='/auth/check-in'>
            Já possuo cadastro
          </Link>
        </form>
      </main>
    );

    function validateForm() {
      return formData.full_name?.length > 0 &&
        formData.social_name?.length > 0 &&
        formData.insurance?.length > 0 &&
        formData.birthdate?.length > 0 &&
        validCpf &&
        !hasSubmitted
        ? 'submit-btn'
        : 'submit-btn disabled';
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      setTimeout(handleSignIn, getRandomInt(750, 2000));
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

    function handleBirthdateInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 3 || value.length === 6) {
        setFormData({
          ...formData,
          birthdate:
            value.slice(0, -1) +
            '/' +
            (value.slice(-1) === '/' ? '' : value.slice(-1)),
        });
      } else {
        setFormData({ ...formData, birthdate: value });
      }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      if (e.target.name === 'birthdate') return null;
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--focused',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.name === 'birthdate') return null;
      return inputRef.current[e.target.name]?.classList.remove(
        'input-field--focused',
      );
    }

    function showAlertCpf() {
      const cpfRegex = /^[0-9.-\s]*$/;
      const containsOnlyNumbers = cpfRegex.test(formData.cpf);
      const transparent = containsOnlyNumbers
        ? validCpf
          ? 'color-transparent'
          : ''
        : '';

      return `alert-text cpf-alert ${transparent}`;
    }

    function showAlertBirthdate() {
      const input = formData.birthdate;
      const millenium = input[0];
      const century = input[1];
      const decade = input[2];
      console.log(
        millenium === '1' || millenium === '2',
        (century === '9' && millenium === '1') ||
          (millenium === '2' && century === '0'),
        ((decade === '0' || decade === '1') && millenium === '2') ||
          millenium === '1',
        new Date(input),
      );
      const birthdateRegex =
        /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

      const validInput = birthdateRegex.test(input);
      const transparent =
        validInput || !input.length ? 'color-transparent' : '';

      return `alert-text birthday-alert ${transparent}`;
    }
  }
}

export default Register;
