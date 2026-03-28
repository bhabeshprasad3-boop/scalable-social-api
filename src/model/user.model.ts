import mongoose, { Schema, HydratedDocument, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

interface IUser {
  username: string;
  email: string;
  bio: string;
  profileURI: string;
  password: string;
  refreshToken?: string;
}

interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;
type UserDocument = HydratedDocument<IUser, IUserMethods>;

//User Schema
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default:"",
    },
    profileURI: {
      type: String,
      default: "",
      trim: true,
    },
    password: { type: String, required: true, select: false },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true },
);

// Password Hashing
userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Password Check
userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

//Generate accesss token
userSchema.methods.generateAccessToken = function (this: UserDocument): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  if (!accessTokenExpiry) {
    throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
  }

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    accessTokenSecret as Secret,
    {
      expiresIn: accessTokenExpiry as SignOptions["expiresIn"],
    },
  );
};

//Generate Refresh Token
userSchema.methods.generateRefreshToken = function (
  this: UserDocument,
): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  if (!refreshTokenExpiry) {
    throw new Error("REFRESH_TOKEN_EXPIRY is not defined");
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret as Secret,
    {
      expiresIn: refreshTokenExpiry as SignOptions["expiresIn"],
    },
  );
};

//Export Schema
const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
