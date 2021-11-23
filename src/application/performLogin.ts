import { Token } from "src/domain/token";
import { UserQueryHandler } from "src/domain/user";

export interface PerformLogin {
  email: string;
  password: string;
}

//exception
export class UserNotFoundError extends Error {
  constructor() {
    super("user not found");
  }
}

export class WrongPasswordError extends Error {
  constructor() {
    super("wrong password");
  }
}

export class PerformLoginHandler {
  readonly userQueryHandler: UserQueryHandler;
  readonly defaultTokenDuration: number;

  constructor(
    userQueryHandler: UserQueryHandler,
    defaultTokenDuration: number
  ) {
    this.userQueryHandler = userQueryHandler;
    this.defaultTokenDuration = defaultTokenDuration;
  }

  async handle(command: PerformLogin): Promise<Token> {
    const user = await this.userQueryHandler.getUserByEmail(command.email);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.passwordMatches(command.password)) {
      throw new WrongPasswordError();
    }

    return Token.create(user.id, user.email, this.defaultTokenDuration);
  }
}
