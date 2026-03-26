import { NextResponse, NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/contact"

// Helper to unwrap params if it's a Promise
async function getParams(params: { id: string } | Promise<{ id: string }>) {
  if ("then" in params) {
    return await params
  }
  return params
}

// ✅ GET ONE
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await getParams(params)

    const message = await Message.findById(id)

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
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await getParams(params)
    const body = await req.json()

    const updated = await Message.findByIdAndUpdate(id, body, { new: true })

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
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await getParams(params)

    const deleted = await Message.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}