import {
  Schema,
  Document,
  model,
  HookNextFunction,
  Types,
  Model,
} from 'mongoose';
import { defaultPopulateOptions as mazePopulateOptions, IMaze } from './Maze';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { generateJwtForUser } from '../utils/jwt';
import QueryOptions from '../../@types/QueryOptions';
import UserNotFoundError from '../errors/UserNotFoundError';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 */

interface IUserBase {
  username: string;
}

export interface IUser extends IUserBase, Document {
  password: string;
  salt: string;
  friends: Types.Array<IUser>;
  ignoredUsers: Types.Array<IUser>;
  likedMazes: Types.Array<IMaze>;
  dislikedMazes: Types.Array<IMaze>;
  createdAt: Date;
  updatedAt: Date;

  validatePassword(password: string): boolean;
  generateJwt(): string;
}

export interface IUserDto extends IUserBase {
  id: string;
}

interface IUserModel extends Model<IUser> {
  toDto(user: IUser): IUserDto;

  getByIdWithFriends(id: Types.ObjectId, opts?: QueryOptions): Promise<IUser>;
  getByIdWithIgnoredUsers(
    id: Types.ObjectId,
    opts?: QueryOptions
  ): Promise<IUser>;
  getByIdWithLikedMazes(
    id: Types.ObjectId,
    opts?: QueryOptions
  ): Promise<IUser>;
  getByIdWithDislikedMazes(
    id: Types.ObjectId,
    opts?: QueryOptions
  ): Promise<IUser>;
  getByUsername(username: string, opts?: QueryOptions): Promise<IUser>;
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

userSchema.pre<IUser>('save', function (next: HookNextFunction) {
  if (this.isModified('password')) {
    this.salt = genSaltSync(10);
    this.password = hashSync(this.password, this.salt);
  }
  next();
});

userSchema.statics.toDto = function (user: IUser): IUserDto {
  return {
    id: user._id,
    username: user.username,
  };
};

function getOrThrowError(id: Types.ObjectId, user: IUser | null): IUser {
  if (!user) {
    throw new UserNotFoundError(id);
  }

  return user;
}

userSchema.statics.getByIdWithFriends = async function (
  this: Model<IUser>,
  id: Types.ObjectId,
  { populate = true, lean = true } = {}
): Promise<IUser> {
  const query = this.findById(id).select({ friends: true });

  populate && query.populate({ path: 'friends', select: { username: true } });
  lean && query.lean();

  const user = await query.exec();

  return getOrThrowError(id, user);
};

userSchema.statics.getByIdWithIgnoredUsers = async function (
  this: Model<IUser>,
  id: Types.ObjectId,
  { populate = true, lean = true } = {}
): Promise<IUser> {
  const query = this.findById(id).select({ ignoredUsers: true });

  populate &&
    query.populate({ path: 'ignoredUsers', select: { username: true } });
  lean && query.lean();

  const user = await query.exec();

  return getOrThrowError(id, user);
};

userSchema.statics.getByIdWithLikedMazes = async function (
  this: Model<IUser>,
  id: Types.ObjectId,
  { populate = true, lean = true } = {}
): Promise<IUser> {
  const query = this.findById(id).select({ likedMazes: true });

  populate &&
    query.populate({ path: 'likedMazes', populate: mazePopulateOptions });
  lean && query.lean();

  const user = await query.exec();

  return getOrThrowError(id, user);
};

userSchema.statics.getByIdWithDislikedMazes = async function (
  this: Model<IUser>,
  id: Types.ObjectId,
  { populate = true, lean = true } = {}
): Promise<IUser> {
  const query = this.findById(id).select({ dislikedMazes: true });

  populate &&
    query.populate({ path: 'dislikedMazes', populate: mazePopulateOptions });
  lean && query.lean();

  const user = await query.exec();

  return getOrThrowError(id, user);
};

userSchema.statics.getByUsername = async function (
  this: Model<IUser>,
  username: string,
  { lean = true } = {}
): Promise<IUser> {
  const query = this.findOne({ username }).select({ username: true });

  lean && query.lean();

  const user = await query.exec();

  if (!user) {
    throw new UserNotFoundError(undefined, username);
  }

  return user;
};

export default model<IUser, IUserModel>('User', userSchema);
