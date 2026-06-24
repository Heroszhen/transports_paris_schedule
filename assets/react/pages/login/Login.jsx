import React, { useEffect, useState } from 'react';
import useUserStore, { getAuth } from '../../stores/userStore.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (null !== user) navigate('/horaires');
  }, [user]);

  useEffect(() => {
    reset({
      email: null,
      password: null,
    });
  }, []);

  const onSubmit = async (data) => {
    localStorage.removeItem('token');
    await getAuth(data);
  };

  return (
    <>
      <section className="vh-100 d-flex justify-content-center align-items-center bg-[#b2cce5]">
        <form className="bg-white p-3 rounded w-[320px]" onSubmit={handleSubmit(onSubmit)}>
          <section className="text-center">
            <div className="text-[#1a1a76]">RATP</div>
            <h2 className="mb-4 text-[#1a1a76]">
              Bonjour
              <br />
              你好
            </h2>
            <h5 className="text-[#159d88]">
              Connexion
              <br />
              登录
            </h5>
          </section>
          <div className="col-12 mb-3">
            <label htmlFor="email" className="form-label">
              Mail*
              <br />
              邮箱*
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              {...register('email', {
                required: { value: true, message: 'Le champ est obligatoire' },
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
            {errors.email?.type === 'required' && (
              <div className="alert alert-danger mt-1">{errors.email?.message}</div>
            )}
          </div>
          <div className="col-12 mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe*
              <br />
              密码
            </label>
            <div className="input-group">
              <input
                type={passwordType}
                className="form-control"
                id="password"
                name="password"
                autoComplete="off"
                {...register('password', { required: { value: true, message: 'Le champ est obligatoire' } })}
              />
              <span
                className="input-group-text cursor-pointer"
                id="basic-eye"
                onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}>
                <i className="bi bi-eye-fill"></i>
              </span>
            </div>
            {errors.password?.type === 'required' && (
              <div className="alert alert-danger mt-1">{errors.password.message}</div>
            )}
          </div>
          <div className="col-12 d-grid gap-2 mb-3">
            <button type="submit" className="btn btn-primary">
              Envoyer
              <br />
              发送
            </button>
          </div>
        </form>
      </section>
    </>
  );
};
export default Login;
