import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Contact from "@/models/contact"

// ============================================
// GET Handler - Fetch all contacts
// ============================================
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB()
    
    // Fetch all contacts, sorted by newest first
    const contacts = await Contact.find().sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true, 
      contacts 
    })

  } catch (err) {
    console.error("GET /api/contact error:", err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}

// ============================================
// POST Handler - Create new contact
// ============================================
export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB()

    // Get data from request body
    const body = await request.json()

    // Validate required fields
    const { name, email, message } = body
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Optional: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Save the contact to database
    const newContact = await Contact.create(body)

    return NextResponse.json({ 
      success: true, 
      message: "Contact saved successfully",
      contact: newContact 
    })

  } catch (err) {
    console.error("POST /api/contact error:", err)
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    )
  }
}