import {
  getAllUsers as selectAllUsers,
  getUserById as selectUserById,
  checkUserExist as checkUserExists,
  createUser as createNewUser,
  updateUserById as updateuserById,
  deleteUserById as deleteuserById,
  deleteAllUsers as deleteAllusers,
} from "../repository/users.repository.js";

import { validationResult } from "express-validator";

//1. Get all users
//====================================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await selectAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({ massage: "users resive successfully", users });
  } catch (error) {
    res.status(500).json({ error: error.massage });
  }
};

//2. Get user by ID
//====================================================

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await selectUserById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ message: "User retrieved successfully", user });
};

//3. Create a new user
//====================================================

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, phone, password } = req.body;

  const userExists = await checkUserExists(email);
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }
  try {
    const newUser = await createNewUser({ fullname, email, phone, password });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//4. Update user by ID
//====================================================
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, phone, password } = req.body;

  try {
    const updatedUser = await updateuserById(id, {
      fullname,
      email,
      phone,
      password,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//5. Delete user by ID
//====================================================
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteuserById(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const deleted = await deleteAllusers();

    if (!deleted) {
      return res.status(404).json({ error: "No users found to delete" });
    }

    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
