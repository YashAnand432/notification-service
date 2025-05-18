import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
