import { storage } from "./storage"

// User storage key
const USER_STORAGE_KEY = "auth_users"

export interface User {
  id: string
  email: string
  password: string
  createdAt: Date
}

// Load users from storage or initialize empty
function getUsers(): Map<string, User> {
  const storedUsers = storage.getItem(USER_STORAGE_KEY) || []

  // Convert the stored array back to a Map
  const usersMap = new Map<string, User>()
  storedUsers.forEach((user: User) => {
    usersMap.set(user.id, {
      ...user,
      createdAt: new Date(user.createdAt),
    })
  })

  return usersMap
}

// Save users to storage
function saveUsers(users: Map<string, User>) {
  // Convert Map to array for storage
  const usersArray = Array.from(users.values())
  storage.setItem(USER_STORAGE_KEY, usersArray)
}

// Browser-compatible password hashing
export async function hashPassword(password: string): Promise<string> {
  // Create a random salt
  const getRandomValues = () => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      return crypto.getRandomValues(new Uint8Array(16))
    }
    // Fallback for environments without crypto
    const values = new Uint8Array(16)
    for (let i = 0; i < 16; i++) {
      values[i] = Math.floor(Math.random() * 256)
    }
    return values
  }

  const salt = Array.from(getRandomValues())
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  // Combine password and salt
  const passwordWithSalt = password + salt

  // Hash the combined string using SHA-256
  const msgBuffer = new TextEncoder().encode(passwordWithSalt)

  // Use subtle crypto if available
  let hashHex
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } else {
    // Simple fallback hash for environments without crypto.subtle
    // This is not secure for production but works for our demo
    let hash = 0
    for (let i = 0; i < passwordWithSalt.length; i++) {
      hash = (hash << 5) - hash + passwordWithSalt.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }
    hashHex = Math.abs(hash).toString(16).padStart(8, "0")
  }

  // Return salt:hash
  return `${salt}:${hashHex}`
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":")

  // Combine password and salt
  const passwordWithSalt = password + salt

  // Hash the combined string
  const msgBuffer = new TextEncoder().encode(passwordWithSalt)

  // Use subtle crypto if available
  let hashHex
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } else {
    // Simple fallback hash for environments without crypto.subtle
    let hash = 0
    for (let i = 0; i < passwordWithSalt.length; i++) {
      hash = (hash << 5) - hash + passwordWithSalt.charCodeAt(i)
      hash |= 0
    }
    hashHex = Math.abs(hash).toString(16).padStart(8, "0")
  }

  // Compare hashes
  return storedHash === hashHex
}

export async function createUser(email: string, password: string): Promise<User> {
  const users = getUsers()

  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15)

  const hashedPassword = await hashPassword(password)

  const user = {
    id,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  }

  users.set(id, user)
  saveUsers(users)

  return user
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = getUsers()

  // Log the number of users in storage for debugging
  console.log(`Searching for user with email: ${email} among ${users.size} users`)

  for (const user of users.values()) {
    if (user.email === email) {
      console.log(`Found matching user with ID: ${user.id}`)
      return user
    }
  }

  console.log(`No user found with email: ${email}`)
  return undefined
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = getUsers()
  return users.get(id)
}

