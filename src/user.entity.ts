export class User {
  constructor({ first_name, last_name, email, phone_number, address }) {
    this.id = Date.now().toString();
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone_number = phone_number;
    this.address = address;
  }
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
}
