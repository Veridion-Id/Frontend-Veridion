import { User } from "@/shared/types/user.types";

export class LocalStorageService {
  private static STORAGE_KEY = "veridion_users";

  // Get all users
  static getUsers(): User[] {
    try {
      const users = localStorage.getItem(this.STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error getting users from localStorage:", error);
      return [];
    }
  }

  // Get user by wallet
  static getUserByWallet(wallet: string): User | null {
    const users = this.getUsers();
    return users.find((user) => user.wallet === wallet) || null;
  }

  // Create new user
  static createUser(userData: Omit<User, "id">): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(), // Simple ID based on timestamp
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    return newUser;
  }

  // Update user
  static updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
  }

  // Delete user
  static deleteUser(userId: string): void {
    const users = this.getUsers();
    const filteredUsers = users.filter((user) => user.id !== userId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
  }

  // Clear all users (for testing)
  static clearUsers(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
