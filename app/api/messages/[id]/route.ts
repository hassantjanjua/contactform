import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/contact"

// ✅ GET ONE MESSAGE
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB()

    const { id } = context.params

    const message = await Message.findById(id)

    // ❗ important fix
    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching message" },
      { status: 500 }
    )
  }
}

// ✅ DELETE MESSAGE
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB()

    const { id } = context.params

    const deleted = await Message.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting message" },
      { status: 500 }
    )
  }
}

// ✅ UPDATE MESSAGE
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB()

    const { id } = context.params
    const body = await req.json()

    const updated = await Message.findByIdAndUpdate(id, body, {
      new: true,
    })

    if (!updated) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating message" },
      { status: 500 }
    )
  }
}