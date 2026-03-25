import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/contact"

// ✅ GET ALL MESSAGES
export async function GET() {
  try {
    await connectDB()

    const messages = await Message.find().sort({ createdAt: -1 })

    // ✅ DIRECT ARRAY RETURN (IMPORTANT)
    return NextResponse.json(messages)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}