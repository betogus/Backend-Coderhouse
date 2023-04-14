import { users } from "../models/User.js";


export async function getUserById(userId) {
    return await users.findById(userId)
} 