import { useRef, ChangeEvent, FocusEvent } from 'react';

function CreatePassword(props: any) {
  const { password, setPassword } = props;
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
          <input
            type='password'
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
        </div>
      </>
    );

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setPassword({ ...password, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
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
  }
}

export default CreatePassword;
