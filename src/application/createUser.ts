// perform the operation : command handler or application service: perform state change
import { Types } from "mongoose";
import { User, UserQueryHandler, UserRepository } from "../domain/user";

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
  //dependency injection
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

// EXPLANATION
//application deals with the implementation of business logic (domain)
//the domain model is supposed to implement logic that is closely related to an entity (eg. remove product from an order
//in memory. While the application coordinates the logic exposed by the domain and deals with for example persisting
// the oder that has been updated by removing a product by a product list.(get order from DB update it with the deleted order kept in mind and save)

// Entity presented with a class
// define operations on the entity
// anemic domain model : interface + function
/// ******
