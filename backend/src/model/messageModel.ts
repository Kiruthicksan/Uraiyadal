import mongoose, { Document, Schema, Types } from "mongoose";

export interface Imessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  image: string;
}

const messageSchema = new Schema<Imessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
