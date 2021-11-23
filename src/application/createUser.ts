// perform the operation : command handler or application service: perform state change
import { Types } from "mongoose";
import { User, UserQueryHandler, UserRepository } from "src/domain/user";

//command: a way to express state mutation (post, ...)
export interface CreateUser {
  email: string;
  password: string;
}
//exception
export class UserAlreadyExistsError extends Error {
  constructor() {
    super("user already exists");
  }
}

// component implementing one specific business operation:
export class CreateUserHandler {
  readonly userQueryHandler: UserQueryHandler;
  readonly userRepository: UserRepository;

  constructor(
    userQueryHandler: UserQueryHandler,
    userRepository: UserRepository
  ) {
    this.userQueryHandler = userQueryHandler;
    this.userRepository = userRepository;
  }

  async handle(command: CreateUser): Promise<User> {
    if (await this.userQueryHandler.getUserByEmail(command.email)) {
      throw new UserAlreadyExistsError();
    }

    const id = new Types.ObjectId().toString();
    const user = User.create(id, command.email, command.password);
    await this.userRepository.add(user);

    return user;
  }
}

// Entity presented with a class
// define operations on the entity
// anemic domain model : interface + function
/// ******
