import { FormEvent, useContext, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import backgroundImage from '../../../public/background-alt.svg';

import DataContext from '../../contexts/DataContext';
import CommonData from '../../components/CommonData';
import LoadingDots from '../../components/Loading';
import RegistryData from '../../components/RegistryData';
import AddressData from '../../components/AddressData/index';
import { getRandomInt } from '../../utils/functions.util';

function Register() {
  const { isSectionComplete, hasSubmitted, setHasSubmitted } =
    useContext(DataContext);
  const pageRef = useRef<HTMLDivElement>(null);

  const RegisterPage = buildRegisterPage();

  return (
    <div
      ref={pageRef}
      id='register-page'
      className='auth-page'
      onLoadCapture={handleLoadCapture}
    >
      <Image
        className='background-image'
        objectFit='cover'
        src={backgroundImage}
        alt='background image'
        priority={true}
        quality={100}
        layout='fill'
      />
      {RegisterPage}
    </div>
  );

  function handleLoadCapture() {
    return pageRef.current?.classList.add('has-loaded');
  }

  function buildRegisterPage() {
    return (
      <form className='auth-page__container' onSubmit={handleSubmit}>
        <h1 className='title-card'>Cadastro</h1>
        <div className='form-sections-wrapper'>
          <CommonData />
          <RegistryData />
          <AddressData />
        </div>
        <div className='footer-section'>
          <button className={validateForm()} type='submit'>
            {hasSubmitted ? <LoadingDots /> : 'Cadastrar'}
          </button>
          <Link className='navigate-link' href='/auth/check-in'>
            Já possuo cadastro
          </Link>
        </div>
      </form>
    );

    function validateForm() {
      return isSectionComplete.address &&
        isSectionComplete.common &&
        isSectionComplete.registry
        ? 'submit-btn'
        : 'submit-btn disabled';
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      setTimeout(() => null, getRandomInt(750, 2000));
    }
  }
}

export default Register;

// TODO feat: add smooth transition between pages
