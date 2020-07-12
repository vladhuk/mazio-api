import { Schema, Document, Types, model, HookNextFunction } from 'mongoose';
import { IMaze } from './Maze';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string;
  friends: IUser[];
  ignored: IUser[];
  liked: IMaze[];
  disliked: IMaze[];

  validatePassword(password: string): boolean;
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

userSchema.pre<IUser>('save', function (next: HookNextFunction) {
  if (this.isModified('password')) {
    this.salt = genSaltSync(10);
    this.password = hashSync(this.password, this.salt);
  }
  next();
});

export default model<IUser>('User', userSchema);
