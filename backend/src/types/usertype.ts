export interface User {
  email: string;
  password: string;
  name: string;
  recipesId?: string[];
  cartId?: string[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  name?: string;
  recipesId?: string[];
  cartId?: string[];
}

export interface UserDelete {
  id: string;
}
