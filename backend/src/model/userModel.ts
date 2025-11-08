import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  profilePic: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      required: true,
      unique: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
