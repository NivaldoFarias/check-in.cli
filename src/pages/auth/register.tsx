import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { validate } from 'gerador-validador-cpf';

import backgroundImage from '../../../public/background-alt.svg';
import { getRandomInt } from '../../utils/functions.util';
import LoadingDots from '../../components/loading';
import BirthdatePicker from '../../components/Calendar';
import Insurance from '../../components/Insurances';

function Register() {
  const [formData, setFormData] = useState({
    cpf: '',
    full_name: '',
    social_name: '',
    insurance: '',
    birthdate: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState<Boolean>(false);

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
    const alertText =
      formData.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;

    return (
      <main className='auth-page__container'>
        <h1 className='title-card'>Cadastro</h1>
        <form className='form-group' onSubmit={handleSubmit}>
          <section className='input-section'>
            <input
              type='text'
              value={formData.full_name}
              name='full_name'
              maxLength={20}
              onChange={handleInputChange}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Nome Completo</label>
          </section>
          <section className='input-section'>
            <input
              type='text'
              value={formData.social_name}
              name='social_name'
              maxLength={25}
              onChange={handleInputChange}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Nome Social</label>
          </section>
          <section className='input-section'>
            <input
              type='text'
              value={formData.insurance}
              name='insurance'
              maxLength={30}
              onChange={handleInputChange}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Convênio</label>
          </section>
          <section className='input-section'>
            <input
              type='text'
              value={formData.cpf}
              name='cpf'
              maxLength={14}
              onChange={handleCPFInput}
              required
              className='input-cpf-field'
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>CPF</label>
            <p className={showAlertText()}>{alertText}</p>
          </section>
          <section className='input-date-section'>
            <p className='input-date-section__label'>Data de nascimento</p>
            <span className='input-date-section__divider'></span>
            <BirthdatePicker />
            <span className='input-date-section__divider'></span>
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

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function showAlertText() {
      const cpfRegex = /^[0-9.-\s]*$/;
      const containsOnlyNumbers = cpfRegex.test(formData.cpf);
      const transparent = containsOnlyNumbers
        ? validCpf
          ? 'color-transparent'
          : ''
        : '';

      return `alert-text-cpf ${transparent}`;
    }
  }
}

export default Register;
