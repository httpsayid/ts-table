export interface Address {
  city: string;
  street: string;
  suite: string;
}

export interface Company {
  name: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: Address;
  company: Company;
  directorFullName?: string;
}
