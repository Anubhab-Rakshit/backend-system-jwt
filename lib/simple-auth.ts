// A simple authentication system that uses localStorage for persistence

// User type
export interface User {
    id: string
    email: string
    password: string
  }
  
  // Simple localStorage wrapper that works in both client and server
  const storage = {
    getItem: (key: string): any => {
      if (typeof window === "undefined") return null
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error)
        return null
      }
    },
  
    setItem: (key: string, value: any): void => {
      if (typeof window === "undefined") return
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error)
      }
    },
  }
  
  // Get all users
  export function getUsers(): User[] {
    return storage.getItem("users") || []
  }
  
  // Save users
  export function saveUsers(users: User[]): void {
    storage.setItem("users", users)
  }
  
  // Create a user
  export async function createUser(email: string, password: string): Promise<User> {
    const users = getUsers()
  
    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      throw new Error("User already exists")
    }
  
    // Create a new user
    const id = Math.random().toString(36).substring(2, 15)
    const hashedPassword = await hashPassword(password)
  
    const newUser = {
      id,
      email,
      password: hashedPassword,
    }
  
    // Save the user
    users.push(newUser)
    saveUsers(users)
  
    return newUser
  }
  
  // Get user by email
  export function getUserByEmail(email: string): User | undefined {
    const users = getUsers()
    return users.find((user) => user.email === email)
  }
  
  // Get user by ID
  export function getUserById(id: string): User | undefined {
    const users = getUsers()
    return users.find((user) => user.id === id)
  }
  
  // Simple password hashing
  export async function hashPassword(password: string): Promise<string> {
    // This is a simplified hash for demo purposes
    return btoa(password)
  }
  
  // Verify password
  export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return btoa(password) === hashedPassword
  }
  
  // JWT functions
  export function createToken(userId: string): string {
    const payload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    }
  
    // Simple token creation (not secure for production)
    return btoa(JSON.stringify(payload))
  }
  
  export function verifyToken(token: string): { sub: string } | null {
    try {
      const payload = JSON.parse(atob(token))
  
      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null
      }
  
      return { sub: payload.sub }
    } catch (error) {
      return null
    }
  }
  
  // Session management
  export function setSession(userId: string): string {
    const token = createToken(userId)
  
    if (typeof window !== "undefined") {
      // Set in cookie
      document.cookie = `session_token=${token};path=/;max-age=${7 * 24 * 60 * 60}`
  
      // Also store in localStorage as backup
      localStorage.setItem("session_token", token)
    }
  
    return token
  }
  
  export function getSession(): { user: User } | null {
    let token = null
  
    // Try to get from cookie first
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";")
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=")
        if (name === "session_token") {
          token = value
          break
        }
      }
    }
  
    // Fall back to localStorage
    if (!token && typeof localStorage !== "undefined") {
      token = localStorage.getItem("session_token")
    }
  
    if (!token) return null
  
    // Verify token
    const payload = verifyToken(token)
    if (!payload) return null
  
    // Get user
    const user = getUserById(payload.sub)
    if (!user) return null
  
    return { user }
  }
  
  export function clearSession(): void {
    if (typeof document !== "undefined") {
      document.cookie = "session_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("session_token")
    }
  }
  
  