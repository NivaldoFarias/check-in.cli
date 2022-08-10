import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { validate } from 'gerador-validador-cpf';

import backgroundImage from '../../../public/background-alt.svg';
import { getRandomInt } from '../../utils/functions.util';
import LoadingDots from '../../components/loading';

function CheckIn() {
  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const checkInPage = buildCheckInPage();

  return (
    <div id='check-in-page'>
      <Image
        className='background-image'
        objectFit='cover'
        src={backgroundImage}
        alt='background image'
        priority={true}
        quality={100}
      />
      {checkInPage}
    </div>
  );

  function buildCheckInPage() {
    const validateForm =
      formData.cpf?.length === 14 &&
      formData.password?.length > 6 &&
      !hasSubmitted
        ? ''
        : 'disabled';

    const alertText =
      formData.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;

    return (
      <main id='check-in-page-container'>
        <h1 className='title-card'>Check-in</h1>
        <form className='form-group' onSubmit={handleSubmit}>
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
          </section>
          <p className={showAlertText()}>{alertText}</p>
          <section className='input-section'>
            <input
              type='password'
              value={formData.password}
              name='password'
              maxLength={20}
              onChange={handleInputChange}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>Senha</label>
          </section>
          <button className={validateForm} type='submit'>
            {hasSubmitted ? <LoadingDots /> : 'Entrar'}
          </button>
          <Link className='register-link' href='/register'>
            Ainda não possuo cadastro
          </Link>
        </form>
      </main>
    );

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
      const validCpf =
        formData.cpf.length === 14 ? validate(formData.cpf) : true;
      const transparent = cpfRegex.test(formData.cpf)
        ? validCpf
          ? 'color-transparent'
          : ''
        : '';

      return `alert-text-cpf ${transparent}`;
    }
  }
}

export default CheckIn;
