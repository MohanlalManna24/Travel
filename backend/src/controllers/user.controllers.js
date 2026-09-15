import {
  getAllUsers as selectAllUsers,
  getUserById as selectUserById,
  checkUserExist as checkUserExists,
  createUser as createNewUser,
} from "../repository/users.repository.js";

//1. Get all users
//====================================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await selectAllUsers();
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
