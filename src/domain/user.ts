import { CreateTracingOptions } from "trace_events";

//We're using entities defined with classers and have certain behavior
export class User {
  readonly id: string;
  readonly email: string;
  readonly password: string;

  private constructor(id: string, email: string, password: string) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  static create(email: string, password: string): User {
    return new User("id", email, password);
  }
}

//domain repository
export interface UserRepository {
  add(user: User): Promise<void>;
  get(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export interface UserQueryHandler {
  getByEmail(email: string): Promise<User | null>;
}

//domain command
export interface CreateUser {
  email: string;
  password: string;
}

//perform the operation : command handler or application service
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
    if (await this.userQueryHandler.getByEmail(command.email)) {
      throw new Error("user exists with same email");
    }

    const user = User.create(command.email, command.password);
    await this.userRepository.add(user);

    return user;
  }
}

// Entity presented with a class
// define operations on the entity
// anemic domain model : interface + function
/// ******
