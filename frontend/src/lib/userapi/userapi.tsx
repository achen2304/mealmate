import users from '../../../testdata/users.json';

export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};
