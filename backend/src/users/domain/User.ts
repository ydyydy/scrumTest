import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { EntityRoot } from '../../../common/core/EntityRoot';
import { UserPassword } from './Password';

export interface UserProps {
  email: string;
  username: string;
  password: UserPassword;
  isAdmin: boolean;
}

export class User extends EntityRoot<UserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get username(): string {
    return this.props.username;
  }

  set username(username: string) {
    this.props.username = username;
  }

  get password(): string {
    return this.props.password.value;
  }

  set password(password: UserPassword) {
    this.props.password = password;
  }

  get userPassword(): UserPassword {
    return this.props.password;
  }

  get isAdmin(): boolean {
    return this.props.isAdmin || false;
  }

  set isAdmin(isAdmin: boolean) {
    this.props.isAdmin = isAdmin;
  }

  public static create(props: UserProps, id?: UniqueEntityID): User {
    const { email, username, password } = props;
    if (!email || !username || !password) {
      throw new Error('[User] Missing properties to create a new user.');
    }

    return new User(props, id);
  }

  public async isValidPassword(password: string): Promise<boolean> {
    return this.props.password.compare(password);
  }
}
