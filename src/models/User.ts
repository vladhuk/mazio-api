import {
  Schema,
  Document,
  model,
  HookNextFunction,
  Types,
  Model,
} from 'mongoose';
import { IMaze } from './Maze';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { generateJwtForUser } from '../utils/jwt';

export interface IUserDto {
  id: Types.ObjectId;
  username: string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string;
  friends: Types.Array<IUser>;
  ignoredUsers: Types.Array<IUser>;
  likedMazes: Types.Array<IMaze>;
  dislikedMazes: Types.Array<IMaze>;

  validatePassword(password: string): boolean;
  generateJwt(): string;
  toDto(): IUserDto;
}

interface IUserModel extends Model<IUser> {
  leanToDto(user: IUser): IUserDto;
}

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ignoredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likedMazes: [{ type: Schema.Types.ObjectId, ref: 'Maze' }],
    dislikedMazes: [{ type: Schema.Types.ObjectId, ref: 'Maze' }],
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
    id: this._id,
    username: this.username,
  };
};

userSchema.statics.leanToDto = function (user: IUser): IUserDto {
  return {
    id: user._id,
    username: user.username,
  };
};

userSchema.pre<IUser>('save', function (next: HookNextFunction) {
  if (this.isModified('password')) {
    this.salt = genSaltSync(10);
    this.password = hashSync(this.password, this.salt);
  }
  next();
});

export default model<IUser, IUserModel>('User', userSchema);
