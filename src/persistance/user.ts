import { Schema, model, connect, Types } from "mongoose";
import { User, UserQueryHandler, UserRepository } from "../domain/user";

// 1. Create an interface representing a document in MongoDB.
interface UserDocument {
  _id: string;
  email: string;
  password: string;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<UserDocument>({
  _id: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: { type: String, required: true },
});

// 3. Create a Model.
const UserModel = model<UserDocument>("User", schema);

// implement UserRepository interface
export class MongoUserRepository implements UserRepository {
  async add(user: User): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email: user.email },
      {
        _id: user.id,
        email: user.email,
        password: user.hashedPassword,
      },
      { new: true, upsert: true }
    );
  }

  async get(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class MongoUserQueryHandler implements UserQueryHandler {
  async getUserByEmail(email: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ email: email }).exec();
    if (!userDocument) {
      return null;
    }
    return User.create(
      userDocument._id,
      userDocument.email,
      userDocument.password
    );
  }
}
