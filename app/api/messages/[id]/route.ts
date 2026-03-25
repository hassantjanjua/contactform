import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/contact"

// ✅ GET ONE
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const message = await Message.findById(params.id)

    if (!message) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ✅ UPDATE
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await req.json()

    const updated = await Message.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON or Server error" }, { status: 500 })
  }
}

// ✅ DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const deleted = await Message.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}