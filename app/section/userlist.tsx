"use client"

import { useEffect, useState } from "react"

type Contact = {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
  createdAt: string
}

export default function UsersList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // ✅ Changed from "/api/test" to "/api/contact"
        const res = await fetch("/api/contact")
        const data = await res.json()
        
        if (!data.success) throw new Error(data.error)
        
        setContacts(data.contacts)
      } catch (err) {
        setError("Failed to load contacts")
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  if (loading) return <div>Loading contacts...</div>
  if (error) return <div style={{ color: "red" }}>{error}</div>

  return (
    <div>
      <h2>📋 Contact Submissions ({contacts.length})</h2>
      {contacts.length === 0 ? (
        <p>No contacts submitted yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {contacts.map((contact) => (
            <li key={contact._id} style={{ 
              border: "1px solid #ccc", 
              padding: "15px", 
              marginBottom: "10px",
              borderRadius: "8px"
            }}>
              <strong>{contact.name}</strong> ({contact.email})
              <br />
              <small>{contact.phone || "No phone"} | {contact.company || "No company"}</small>
              <p>{contact.message}</p>
              <small style={{ color: "gray" }}>
                {new Date(contact.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}