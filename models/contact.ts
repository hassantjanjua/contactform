import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    company: String,
    subject: String,
    message: String,
  },
  { timestamps: true }
)

// ❗ overwrite fix
export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema)