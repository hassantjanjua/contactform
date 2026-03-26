import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return

    await mongoose.connect(process.env.MONGODB_URI as string)
  } catch (error) {
    console.log(error)
  }
}