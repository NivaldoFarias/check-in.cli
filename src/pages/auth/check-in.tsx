import type { ChangeEvent, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getRandomInt } from '../../utils/functions.util';
import LoadingDots from '../../components/loading';

import backgroundImage from '../../../public/background-alt.svg';

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
      formData.cpf?.length === 11 &&
      formData.password?.length > 6 &&
      !hasSubmitted
        ? ''
        : 'disabled';

    return (
      <main id='check-in-page-container'>
        <h1 className='title-card'>Check-in</h1>
        <form className='form-group' onSubmit={handleSubmit}>
          <section className='input-section'>
            <input
              type='text'
              value={formData.cpf}
              name='cpf'
              onChange={handleInputChange}
              required
            />
            <span className='highlight'></span>
            <span className='bar'></span>
            <label>CPF</label>
          </section>
          <section className='input-section'>
            <input
              type='password'
              value={formData.password}
              name='password'
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

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }
}

export default CheckIn;
