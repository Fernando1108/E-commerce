export type UserProfile = {
  id: string;
  name: string;
  email: string;
  address: string;
  avatar: string;
};

export type UpdateProfileInput = Omit<UserProfile, 'id' | 'email'> & {
  email?: string;
};
