import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true},
    type: {
        type: String,
        enum: ['income','expense'],
        required:true
    },
    category: { type: String, required: true},
    date: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Transactions=mongoose.model('Transactions',transactionSchema)
export default Transactions
