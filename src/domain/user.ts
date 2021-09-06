import bcrypt from "bcrypt";

//We're using entities defined with classers and have certain behavior
export class User {
  readonly id: string;
  readonly email: string;
  readonly hashedPassword: string;

  private constructor(id: string, email: string, hashedPassword: string) {
    this.id = id;
    this.email = email;
    this.hashedPassword = hashedPassword;
  }
  // static method doesn't have a state, it's called on the class
  static create(email: string, password: string): User {
    // hash password with bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);
    return new User("id", email, hashedPassword);
  }

  passwordMatches(password: string): boolean {
    return bcrypt.compareSync(password, this.hashedPassword);
  }
}

//domain repository : abstraction layer used to represent database/datasource
export interface UserRepository {
  add(user: User): Promise<void>; //upsert method: update or insert
  get(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export interface UserQueryHandler {
  getUserByEmail(email: string): Promise<User | null>;
}

//domain command
export interface CreateUser {
  email: string;
  password: string;
}

export class UserAlreadyExistsError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

// perform the operation : command handler or application service: perform state change
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
      throw new UserAlreadyExistsError("");
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
