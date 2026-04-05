import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  category: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  notes: {
  type: String
}
}, { timestamps: true });

export default mongoose.model("Record", recordSchema);