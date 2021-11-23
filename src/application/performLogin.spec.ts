import { User, UserQueryHandler, UserRepository } from "../domain/user";
import { CreateUserHandler, UserAlreadyExistsError } from "./createUser";
import {
  PerformLoginHandler,
  UserNotFoundError,
  WrongPasswordError,
} from "./performLogin";

describe("Perform login command", () => {
  beforeAll(() => {
    process.env.JWT_KEY = "not-a-secret";
  });

  test("fails when a user doesn't exist", async () => {
    const userQueryHandler: UserQueryHandler = {
      getUserByEmail: async (email) => {
        return null;
      },
    };

    const handler = new PerformLoginHandler(userQueryHandler, 10);

    await expect(
      handler.handle({ email: "my@email.com", password: "test" })
    ).rejects.toThrowError(new UserNotFoundError());
  });

  test("fails when the password provided in input doesn't match the user's", async () => {
    const userQueryHandler: UserQueryHandler = {
      getUserByEmail: async (email) => {
        expect(email).toEqual("my@email.com");
        return User.create("testUser", "my@email.com", "test");
      },
    };

    const handler = new PerformLoginHandler(userQueryHandler, 10);

    await expect(
      handler.handle({ email: "my@email.com", password: "wrong password" })
    ).rejects.toThrowError(new WrongPasswordError());
  });

  test("it works", async () => {
    const userQueryHandler: UserQueryHandler = {
      getUserByEmail: async (email) => {
        expect(email).toEqual("my@email.com");
        return User.create("testUser", "my@email.com", "test");
      },
    };

    const handler = new PerformLoginHandler(userQueryHandler, 10);

    await expect(
      handler.handle({ email: "my@email.com", password: "test" })
    ).resolves.toBeDefined();
  });
});
