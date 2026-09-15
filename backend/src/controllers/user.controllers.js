import { getAllUsers as selectAllUsers } from "../repository/users.repository.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await selectAllUsers();
    res.status(200).json({ massage: "users resive successfully", users });
  } catch (error) {
    res.status(500).json({ error: error.massage });
  }
};
