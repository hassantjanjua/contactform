import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/contact"

// ✅ GET ALL MESSAGES
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const messages = await Message.find()
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ✅ POST NEW MESSAGE
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const message = await Message.create(body)
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON or Server error" }, { status: 500 })
  }
}