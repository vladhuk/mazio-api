import { Schema, Document, Types, model, HookNextFunction } from 'mongoose';
import { IMaze } from './Maze';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string;
  friends: IUser[];
  ignored: IUser[];
  liked: IMaze[];
  disliked: IMaze[];

  validatePassword(password: string): boolean;
  generateJWT(): string;
}

export interface IJWTPayload {
  sub: string;
  exp: number;
  iat: number;
}

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    friends: [{ type: Types.ObjectId, ref: 'User' }],
    ignored: [{ type: Types.ObjectId, ref: 'User' }],
    liked: [{ type: Types.ObjectId, ref: 'Maze' }],
    disliked: [{ type: Types.ObjectId, ref: 'Maze' }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = function (password: string): boolean {
  const hash = hashSync(password, this.salt);
  return compareSync(password, hash);
};

userSchema.methods.generateJWT = function (): string {
  const iat = new Date();
  const age = parseInt(process.env.jwt_age!);
  const exp = new Date(iat);
  exp.setSeconds(iat.getSeconds() + age);

  const jwtPayload: IJWTPayload = {
    sub: this._id,
    exp: exp.getTime() / 1000,
    iat: iat.getTime() / 1000,
  };

  return jwt.sign(jwtPayload, process.env.jwt_secret!);
};

userSchema.pre<IUser>('save', function (next: HookNextFunction) {
  if (this.isModified('password')) {
    this.salt = genSaltSync(10);
    this.password = hashSync(this.password, this.salt);
  }
  next();
});

export default model<IUser>('User', userSchema);
