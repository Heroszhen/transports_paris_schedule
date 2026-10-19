import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/login/Login';
import { getAuth } from '../../stores/userStore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<typeof import('react-router-dom')>('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: () => jest.fn(),
}));

jest.mock('../../stores/userStore', () => ({
  __esModule: true,
  default: () => ({ user: null }),
  getAuth: jest.fn(),
  getGmailLoginToken: jest.fn(),
}));

describe('login - on page', () => {
  test('il y a un formulaire sur la page', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Bonjour/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/Mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Envoyer/i,
      })
    ).toBeInTheDocument();
  });
});

describe('login - fill form', () => {
  let submitBtn: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;

  beforeEach(() => {
    user = userEvent.setup();
    render(<Login />);

    submitBtn = screen.getByRole('button', { name: /Envoyer/i });
    emailInput = screen.getByLabelText(/Mail/i);
    passwordInput = screen.getByLabelText(/Mot de passe/i);
  });

  test("pas d'erreur affichée avant l'envoi", () => {
    expect(screen.queryAllByText('Le champ est obligatoire')).toHaveLength(0);
  });

  test('affiche 2 erreurs quand on envoie le formulaire vide', async () => {
    await user.click(submitBtn);

    expect(screen.queryAllByText('Le champ est obligatoire')).toHaveLength(2);
  });

  test('envoyer le formulaire remplir', async () => {
    jest.mocked(getAuth).mockResolvedValue(true);

    const email = 'abc@gmail.com';
    const password = 'aaaaaaaa';

    await user.type(emailInput, email);
    await user.type(passwordInput, password);

    expect(emailInput).toHaveValue(email);
    expect(passwordInput).toHaveValue(password);

    await user.click(submitBtn);

    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(getAuth).toHaveBeenCalledWith({
      email,
      password,
    });
  });
});
