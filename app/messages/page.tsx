"use client"

import { useEffect, useState } from "react"

type Message = {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

export default function MessagesPage() {

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Message | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages")
        const text = await res.text()

        let data: unknown = null

        try {
          data = JSON.parse(text)
        } catch {
          return
        }

        if (Array.isArray(data)) {
          setMessages(data as Message[])
        } else if (
          typeof data === "object" &&
          data !== null &&
          "success" in data
        ) {
          const typed = data as { success: boolean; data: Message[] }
          if (typed.success) setMessages(typed.data)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleEdit = (msg: Message) => {
    setEditId(msg._id)
    setEditData({ ...msg })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    await fetch(`/api/messages/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData)
    })

    setMessages(prev =>
      prev.map(msg =>
        msg._id === editId ? (editData as Message) : msg
      )
    )

    setEditId(null)
    setEditData(null)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "DELETE" })
    setMessages(prev => prev.filter(msg => msg._id !== id))
  }

  const handleCancel = () => {
    setEditId(null)
    setEditData(null)
  }

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase()) ||
    msg.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc] p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 relative">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Messages
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and review all user submissions
          </p>
        </div>

        <div className="flex items-center gap-4 relative">

          {/* SEARCH */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="px-4 py-2 rounded-xl border bg-white shadow-sm text-sm w-64 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {search && (
              <div className="absolute bg-white border rounded-xl shadow-lg mt-2 w-64 max-h-40 overflow-auto z-50">
                {messages
                  .filter(msg =>
                    msg.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((msg) => (
                    <div
                      key={msg._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                      onClick={() => setSearch(msg.name)}
                    >
                      {msg.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="relative">
            <button className="bg-black text-white px-5 py-2 rounded-xl text-sm shadow-md pointer-events-none">
              Messages
            </button>

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {messages.length}
            </span>
          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Total Messages</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {messages.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Active Users</p>
          <h2 className="text-2xl font-bold text-green-600 mt-1">
            {messages.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold text-orange-500 mt-1">
            {messages.length}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg._id} className="border-t hover:bg-gray-50 transition">

                  {/* USER */}
                  <td className="px-6 py-4 text-gray-800">
                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {msg.name ? msg.name.charAt(0) : ""}
                      </div>

                      <div className="w-full">
                        {editId === msg._id ? (
                          <>
                            <input name="name" value={editData?.name || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full mb-1 text-black"/>
                            <input name="email" value={editData?.email || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full text-black"/>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-gray-800">{msg.name}</p>
                            <p className="text-xs text-gray-500">{msg.email}</p>
                          </>
                        )}
                      </div>

                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-4 text-gray-700">
                    {editId === msg._id ? (
                      <input name="phone" value={editData?.phone || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full text-black"/>
                    ) : msg.phone}
                  </td>

                  {/* COMPANY */}
                  <td className="px-6 py-4 text-gray-700">
                    {editId === msg._id ? (
                      <input name="company" value={editData?.company || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full text-black"/>
                    ) : msg.company}
                  </td>

                  {/* SUBJECT */}
                  <td className="px-6 py-4 text-gray-800">
                    {editId === msg._id ? (
                      <input name="subject" value={editData?.subject || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full text-black"/>
                    ) : msg.subject}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right space-x-2">

                    {editId === msg._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-xs border border-green-500 hover:bg-white hover:text-green-500 transition"
                        >
                          Save
                        </button>

                        <button
                          onClick={handleCancel}
                          className="bg-gray-400 text-white px-3 py-1 rounded-md text-xs border border-gray-400 hover:bg-white hover:text-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(msg)} className="px-3 py-1 border border-black text-black rounded-md text-xs font-semibold hover:bg-black hover:text-white transition">
                          Edit
                        </button>

                        <button onClick={() => handleDelete(msg._id)} className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-xs font-semibold hover:bg-red-500 hover:text-white transition">
                          Delete
                        </button>
                      </>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  )
}