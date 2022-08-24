import { useRef, ChangeEvent, FocusEvent, useState } from 'react';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

function CreatePassword(props: any) {
  const { password, setPassword } = props;
  const [focusedRef, setFocusedRef] = useState<HTMLInputElement | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const createPasswordComponent = buildCreatePasswordComponent();

  return (
    <section className='create-password-section form-group'>
      {createPasswordComponent}
    </section>
  );

  function buildCreatePasswordComponent() {
    return (
      <>
        <div className='input-section'>
          {showPassword ? (
            <RiEyeCloseLine
              className='input-section__eye-icon eyes-closed'
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <RiEyeLine
              className='input-section__eye-icon eyes-open'
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          <input
            type={showPassword ? 'text' : 'password'}
            minLength={6}
            maxLength={22}
            name='password'
            className={`input-field input-field-password ${
              password.password.length > 0 ? 'input-field--active' : ''
            }`}
            value={password?.password}
            ref={passwordRef}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Senha</label>
        </div>
        <div className='input-section'>
          <input
            type='password'
            minLength={6}
            maxLength={22}
            name='confirm'
            className={`input-field input-field-password ${
              password.confirm.length > 0 ? 'input-field--active' : ''
            }`}
            value={password?.confirm}
            ref={confirmPasswordRef}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Confirmar senha</label>
          <p className={alertClassName()}>Senhas não correspondem</p>
        </div>
      </>
    );

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setPassword({ ...password, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      setFocusedRef(e.target);
      if (e.target.name === 'password') {
        passwordRef.current?.classList.add('input-field--active');
      }
      if (e.target.name === 'confirm') {
        confirmPasswordRef.current?.classList.add('input-field--active');
      }
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length !== 0) return null;

      if (e.target.name === 'password') {
        return passwordRef.current?.classList.remove('input-field--active');
      }
      if (e.target.name === 'confirm') {
        return confirmPasswordRef.current?.classList.remove(
          'input-field--active',
        );
      }
    }

    function alertClassName() {
      return `alert-text ${
        focusedRef === confirmPasswordRef.current &&
        password.confirm.length >= password.password.length &&
        password.password !== password.confirm
          ? ''
          : 'color-transparent'
      }`;
    }
  }
}

export default CreatePassword;
