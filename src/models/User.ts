import { Schema, Document, model, HookNextFunction, Types } from 'mongoose';
import { IMaze } from './Maze';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { generateJwtForUser } from '../utils/jwt';

export interface IUserDto {
  _id: Types.ObjectId;
  username: string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string;
  friends: IUser[];
  ignored: IUser[];
  liked: IMaze[];
  disliked: IMaze[];

  validatePassword(password: string): boolean;
  generateJwt(): string;
  toDto(): IUserDto;
}

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ignored: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    liked: [{ type: Schema.Types.ObjectId, ref: 'Maze' }],
    disliked: [{ type: Schema.Types.ObjectId, ref: 'Maze' }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = function (password: string): boolean {
  const hash = hashSync(password, this.salt);
  return compareSync(password, hash);
};

userSchema.methods.generateJwt = function (): string {
  return generateJwtForUser(this._id);
};

userSchema.methods.toDto = function (): IUserDto {
  return {
    _id: this._id,
    username: this.username,
  };
};

userSchema.pre<IUser>('save', function (next: HookNextFunction) {
  if (this.isModified('password')) {
    this.salt = genSaltSync(10);
    this.password = hashSync(this.password, this.salt);
  }
  next();
});

export default model<IUser>('User', userSchema);
