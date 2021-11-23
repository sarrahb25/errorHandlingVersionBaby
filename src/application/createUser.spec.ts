import { User, UserQueryHandler, UserRepository } from "../domain/user";
import { CreateUserHandler, UserAlreadyExistsError } from "./createUser";

describe("Create user command", () => {
  test("fails when a user already exists with the same email", async () => {
    const userQueryHandler: UserQueryHandler = {
      getUserByEmail: async (email) => {
        expect(email).toEqual("my@email.com");
        return User.create("testUser", "my@email.com", "test");
      },
    };

    const handler = new CreateUserHandler(
      userQueryHandler,
      jest.genMockFromModule("../domain/user")
    );

    await expect(
      handler.handle({ email: "my@email.com", password: "test" })
    ).rejects.toThrowError(new UserAlreadyExistsError());
  });

  test("succeeds when a user does not exist with specified email", async () => {
    const userQueryHandler: UserQueryHandler = {
      getUserByEmail: async (email) => {
        expect(email).toEqual("my1@email.com");
        return null;
      },
    };

    const userRepository: UserRepository = {
      add: async (user) => {
        expect(user.email).toEqual("my1@email.com");
        expect(user.passwordMatches("test")).toBeTruthy();
      },
      get: async (id) => {
        fail("should not be called");
      },
      delete: async (user) => {
        fail("should not be called");
      },
    };

    const handler = new CreateUserHandler(userQueryHandler, userRepository);

    await handler.handle({ email: "my1@email.com", password: "test" });
  });
});
