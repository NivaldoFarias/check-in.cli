import { FormEvent, useContext, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { confirmAlert } from 'react-confirm-alert';

import backgroundImage from '../../../public/background-alt.svg';

import DataContext from '../../contexts/DataContext';
import CommonData from '../../components/CommonData';
import LoadingDots from '../../components/Loading';
import RegistryData from '../../components/RegistryData';
import AddressData from '../../components/AddressData/index';
import { getRandomInt } from '../../utils/functions.util';
import CreatePassword from '../../components/CreatePassword';
import { Forms } from '../../types';

function Register() {
  const [password, setPassword] = useState<{
    password: string;
    confirm: string;
  }>({
    password: '',
    confirm: '',
  });
  const [toggleActiveSection, setActiveSection] = useState<boolean>(false);
  const {
    isSectionComplete,
    setHasSubmitted,
    commonData,
    registryData,
    addressData,
  } = useContext(DataContext);
  const pageRef = useRef<HTMLDivElement>(null);

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

  const registerPage = buildRegisterPage();

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
      {registerPage}
    </div>
  );

  function handleLoadCapture() {
    return pageRef.current?.classList.add('has-loaded');
  }

  function buildRegisterPage() {
    return (
      <form className='auth-page__container' onSubmit={handleSubmit}>
        <h1 className='title-card'>Cadastro</h1>
        {toggleActiveSection ? (
          <CreatePassword password={password} setPassword={setPassword} />
        ) : (
          <div className='form-sections-wrapper'>
            <CommonData />
            <RegistryData />
            <AddressData />
          </div>
        )}

        <div className='footer-section'>
          {toggleActiveSection ? (
            <button className={validateForm()} type='submit'>
              Cadastrar
            </button>
          ) : (
            <button className={validateForm()} onClick={openModal}>
              Continuar
            </button>
          )}

          {toggleActiveSection ? (
            <div className='return-btn' onClick={() => setActiveSection(false)}>
              {'Editar meus dados'}
            </div>
          ) : (
            <Link href='/auth/check-in'>Já possuo cadastro</Link>
          )}
        </div>
      </form>
    );

    function validateForm() {
      if (toggleActiveSection) {
        return password.password.length > 0 &&
          password.confirm.length > 0 &&
          password.confirm === password.password
          ? 'submit-btn'
          : 'submit-btn disabled';
      } else {
        return isSectionComplete.address &&
          isSectionComplete.common &&
          isSectionComplete.registry
          ? 'submit-btn'
          : 'submit-btn disabled';
      }
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      console.log(toggleActiveSection);
      const common = {
        ...commonData,
        password: password.password,
      };
      const registry = {
        ...registryData,
        gender:
          registryData.gender === 'SELF_DESCRIBED'
            ? registryData.gender
            : registryData.described_identity ?? 'Não informado',
        assigned_at_birth:
          registryData.assigned_at_birth === 'SELF_DESCRIBED'
            ? registryData.assigned_at_birth
            : registryData.described_assigned ?? 'Não informado',
      };
      delete registryData.described_identity;
      delete registryData.described_assigned;

      const address = { ...addressData };

      return registerPatient({
        common,
        registry,
        address,
      });
    }

    function openModal(e: FormEvent) {
      e.preventDefault();
      confirmAlert({
        message: `Quase lá! Agora só precisamos de uma senha para você conseguir acessar sua conta.`,
        buttons: [
          {
            label: 'Definir senha',
            onClick: () => setActiveSection(true),
          },
        ],
      });
    }

    async function registerPatient(data: Forms) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log(result);
        return handleSucess();
      } catch (error) {
        return handleError(error);
      }
    }

    function handleSucess() {
      confirmAlert({
        message: `Tudo pronto!`,
        buttons: [
          {
            label: 'Fazer check-in',
            onClick: () => {
              window.location.href = '/auth/check-in';
            },
          },
        ],
      });
    }

    function handleError(error: any) {
      console.log(error);
      confirmAlert({
        message: `Ops! Algo deu errado. Por favor, tente novamente.`,
        buttons: [
          {
            label: 'OK',
            onClick: () => null,
          },
        ],
      });
    }
  }
}

export default Register;
