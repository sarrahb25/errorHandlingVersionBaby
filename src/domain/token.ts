import jwt from "jsonwebtoken";

export class Token {
  readonly value: string;
  readonly duration: number;
  readonly userId: string;

  private constructor(value: string, duration: number, userId: string) {
    this.value = value;
    this.duration = duration;
    this.userId = userId;
  }

  static create(userId: string, email: string, duration: number): Token {
    const token = jwt.sign({ email, userId }, process.env.JWT_KEY!, {
      expiresIn: duration,
    });
    return new Token(token, duration, userId);
  }
}
