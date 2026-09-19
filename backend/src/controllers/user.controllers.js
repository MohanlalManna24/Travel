import {
  getAllUsers as selectAllUsers,
  getUserById as selectUserById,
  checkUserExist as checkUserExists,
  createUser as createNewUser,
  updateUserById as updateuserById,
  deleteUserById as deleteuserById,
  deleteAllUsers as deleteAllusers,
} from "../repository/users.repository.js";
import { updateUserFullDetails } from "../repository/userFullDetails.repository.js";
import { validationResult } from "express-validator";

// 1. Get all users
// ====================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await selectAllUsers();
    res.status(200).json({ message: "Users retrieved successfully", users: users || [] });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve users" });
  }
};

// 2. Get user by ID
// ====================================================
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await selectUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve user" });
  }
};

// 3. Create a new user
// ====================================================
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, name, email, phone, password, status = "active", avatar, profileImg, location, city, state } = req.body;
  const userName = fullname || name;

  try {
    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const newUser = await createNewUser({
      fullname: userName,
      email,
      phone: phone ? String(phone).replace(/\D/g, "") : "",
      password: password || "Password@123",
      status: status || "active",
    });

    if (avatar || profileImg || location || city || state) {
      try {
        await updateUserFullDetails(newUser.id, {
          profileImg: avatar || profileImg,
          city: city || location || "Not specified",
          state: state || "Not specified",
        });
      } catch (err) {
        console.error("Failed to save initial full details:", err);
      }
    }

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
};

// 4. Update user by ID
// ====================================================
export const updateUserById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { fullname, name, email, phone, password, status, avatar, profileImg, location, city, state } = req.body;
  const userName = fullname || name;

  try {
    // Check if user exists
    const existing = await selectUserById(id);
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    // If email is changing, check for duplicates
    if (email && email !== existing.email) {
      const emailTaken = await checkUserExists(email, id);
      if (emailTaken) {
        return res.status(400).json({ error: "Email is already taken by another user" });
      }
    }

    const cleanPhone = phone !== undefined ? String(phone).replace(/\D/g, "") : undefined;

    const updatedUser = await updateuserById(id, {
      fullname: userName !== undefined ? userName : existing.fullname,
      email: email !== undefined ? email : existing.email,
      phone: cleanPhone !== undefined ? cleanPhone : existing.phone,
      password: password || undefined,
      status: status !== undefined ? status : existing.status,
    });

    if (avatar !== undefined || profileImg !== undefined || location !== undefined || city !== undefined || state !== undefined) {
      try {
        await updateUserFullDetails(id, {
          profileImg: avatar || profileImg,
          city: city || location,
          state: state,
        });
      } catch (err) {
        console.error("Failed to sync updated full details:", err);
      }
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
};

// 5. Delete user by ID
// ====================================================
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteuserById(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
};

// 6. Delete all users
// ====================================================
export const deleteAllUsers = async (req, res) => {
  try {
    const deleted = await deleteAllusers();
    if (!deleted) {
      return res.status(404).json({ error: "No users found to delete" });
    }
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete all users" });
  }
};

