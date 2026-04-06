import type {
  AuthActionResult,
  AuthUser,
  ForgotPasswordFormValues,
  LoginFormValues,
  LoginResult,
  RegisterFormValues,
  RegisterResult,
} from '@/features/auth/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_USER = {
  email: 'demo@novastore.com',
  password: 'NovaStore123',
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isBlockedEmail = (email: string) => normalizeEmail(email).endsWith('@blocked.com');

const buildUser = (overrides: Partial<AuthUser> & Pick<AuthUser, 'email' | 'fullName'>): AuthUser => ({
  id: overrides.id ?? crypto.randomUUID(),
  fullName: overrides.fullName,
  email: normalizeEmail(overrides.email),
  phone: overrides.phone ?? null,
});

export const authService = {
  async login(values: LoginFormValues): Promise<LoginResult> {
    await wait(900);

    const email = normalizeEmail(values.email);

    if (isBlockedEmail(email)) {
      throw new Error('No fue posible iniciar sesión con este correo.');
    }

    if (email !== MOCK_USER.email || values.password !== MOCK_USER.password) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    return {
      message: 'Inicio de sesión correcto. Redirección simulada lista.',
      user: buildUser({
        id: 'mock-user-1',
        fullName: 'Usuario Demo NovaStore',
        email,
        phone: '+57 300 123 4567',
      }),
    };
  },

  async register(values: RegisterFormValues): Promise<RegisterResult> {
    await wait(1100);

    const email = normalizeEmail(values.email);

    if (isBlockedEmail(email)) {
      throw new Error('Este dominio de correo no está permitido en el entorno mock.');
    }

    if (values.password !== values.confirmPassword) {
      throw new Error('Las contraseñas no coinciden.');
    }

    if (values.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    return {
      message: `Cuenta mock creada para ${values.fullName}. Ya puedes continuar al acceso.`,
      user: buildUser({
        fullName: values.fullName.trim(),
        email,
        phone: values.phone.trim(),
      }),
    };
  },

  async forgotPassword(values: ForgotPasswordFormValues): Promise<AuthActionResult> {
    await wait(850);

    const email = normalizeEmail(values.email);

    if (isBlockedEmail(email)) {
      throw new Error('No pudimos procesar la solicitud para este correo.');
    }

    return {
      message: `Si ${email} existe en NovaStore, recibirás instrucciones para restablecer tu contraseña.`,
    };
  },
};
