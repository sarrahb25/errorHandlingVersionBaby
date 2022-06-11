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
  static create(id: string, email: string, password: string): User {
    // hash password with bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);
    return new User(id, email, hashedPassword);
  }

  passwordMatches(password: string): boolean {
    return bcrypt.compareSync(password, this.hashedPassword);
  }
}

//domain repository  (domaine service like the validators): abstraction layer used to represent database/datasource
//would be better to add getUserByEmail here as well
export interface UserRepository {
  add(user: User): Promise<void>; //upsert method: update or insert
  get(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export interface UserQueryHandler {
  getUserByEmail(email: string): Promise<User | null>;
}


//domain describes business so probably repository doesn't live here?
//DDD for domain part should be understood by even non-engineer. The domain description (models) 
//need to be clear to PO as well 