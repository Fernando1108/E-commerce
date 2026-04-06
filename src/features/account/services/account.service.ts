import type { UpdateProfileInput, UserProfile } from '@/features/account/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let userDB: UserProfile = {
  id: 'mock-user-1',
  name: 'Usuario Demo NovaStore',
  email: 'demo@novastore.com',
  address: 'Calle 123 #45-67, Bogota, Colombia',
  avatar: '/assets/images/app_logo.png',
};

let userPassword = 'NovaStore123';

export const accountService = {
  async getProfile(): Promise<UserProfile> {
    await wait(500);
    return { ...userDB };
  },

  async updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
    await wait(700);

    userDB = {
      ...userDB,
      ...data,
      email: data.email ?? userDB.email,
    };

    return { ...userDB };
  },

  async updatePassword(password: string): Promise<void> {
    await wait(600);

    if (password.trim().length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    userPassword = password;
    void userPassword;
  },
};
