import * as bcrypt from 'bcrypt';
import { ValueObject } from '../../../common/core/ValueObject';
import {
  PASSWORD_HASH_SALT_ROUNDS,
  PASSWORD_PATTERN,
} from '../../../common/utils/Constants';

interface UserpasswordProps {
  password: string;
}

export class UserPassword extends ValueObject<UserpasswordProps> {
  private constructor(props: UserpasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.password;
  }

  public static async create(value: string): Promise<UserPassword> {
    if (!PASSWORD_PATTERN.test(value)) {
      throw new Error('Password does not meet the required pattern.');
    }

    const hashedPassword = await bcrypt.hash(value, PASSWORD_HASH_SALT_ROUNDS);
    return new UserPassword({ password: hashedPassword });
  }

  public static fromHashedPassword(value: string): UserPassword {
    return new UserPassword({ password: value });
  }

  public async compare(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.value);
  }
}
