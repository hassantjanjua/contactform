"use client"

import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"

type FormData = {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

type ApiResponse = {
  success: boolean
}

export default function ContactForm() {

  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  })

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"success" | "error" | "">("")

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data: ApiResponse = await response.json()

      if (response.ok && data.success) {
        setStatus("success")

        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: ""
        })

      } else {
        setStatus("error")
      }

    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-100 via-gray-100 to-gray-100 p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">
            Contact Form
          </h2>

          <button
            onClick={() => router.push("/messages")}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm border border-black hover:bg-white hover:text-black hover:border-black transition"
          >
            View Messages
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="company"
              placeholder="Company / Organization"
              value={formData.company}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          <input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            rows={5}
            maxLength={500}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />

          <p className="text-xs text-gray-500 text-right">
            {formData.message.length}/500
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg border border-black hover:bg-white hover:text-black hover:border-black transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {/* STATUS */}
          {status === "success" && (
            <p className="text-green-600 text-center text-sm">
              Message sent successfully
            </p>
          )}

          {status === "error" && (
            <p className="text-red-500 text-center text-sm">
              Something went wrong
            </p>
          )}

        </form>
      </div>
    </section>
  )
}