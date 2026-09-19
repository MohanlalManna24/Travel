import {
  getAllUsers as selectAllUsers,
  getUserById as selectUserById,
  getUserByEmailWithPassword,
  updateUserRefreshToken,
  getUserByRefreshToken,
  clearUserRefreshToken,
  checkUserExist as checkUserExists,
  createUser as createNewUser,
  updateUserById as updateuserById,
  deleteUserById as deleteuserById,
  deleteAllUsers as deleteAllusers,
} from "../repository/users.repository.js";
import {
  getUserFullDetailsByUserId,
  updateUserFullDetails,
} from "../repository/userFullDetails.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getCookieOptions,
} from "../utils/token.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

// ============================================================================
// 1. AUTH: REGISTER USER
// ============================================================================
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), error: errors.array()[0].msg });
  }

  const { fullname, fullName, name, email, phone, password } = req.body;
  const userName = fullname || fullName || name;

  try {
    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, "") : `91${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newUser = await createNewUser({
      fullname: userName,
      email,
      phone: cleanPhone,
      password,
      status: "active",
    });

    // Create / update initial full details profile
    try {
      await updateUserFullDetails(newUser.id, {
        profileImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
        city: "Kolkata",
        state: "West Bengal",
      });
    } catch (e) {
      // Non-blocking
    }

    // Generate JWT Access & Refresh Tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Save refresh token in DB
    await updateUserRefreshToken(newUser.id, refreshToken);

    // Set secure HTTP-only cookies
    res.cookie("accessToken", accessToken, getCookieOptions(false));
    res.cookie("refreshToken", refreshToken, getCookieOptions(true));

    res.status(201).json({
      message: "Registration successful! Welcome to Ghure Ashi.",
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        status: newUser.status,
        role: "traveler",
      },
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Failed to register user" });
  }
};

// ============================================================================
// 2. AUTH: LOGIN USER
// ============================================================================
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const user = await getUserByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (user.status === "inactive" || user.status === "suspended") {
      return res.status(403).json({ error: "Your account is inactive. Please contact support." });
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT Access & Refresh Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Persist refresh token in DB
    await updateUserRefreshToken(user.id, refreshToken);

    // Set HTTP-Only cookies
    res.cookie("accessToken", accessToken, getCookieOptions(false));
    res.cookie("refreshToken", refreshToken, getCookieOptions(true));

    // Fetch extended profile if present
    let extendedProfile = null;
    try {
      extendedProfile = await getUserFullDetailsByUserId(user.id);
    } catch (e) {
      // Ignore
    }

    res.status(200).json({
      message: "Login successful! Welcome back.",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        status: user.status,
        avatar: extendedProfile?.profileImg || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
        city: extendedProfile?.city || "",
        state: extendedProfile?.state || "",
        role: "traveler",
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Failed to log in" });
  }
};

// ============================================================================
// 3. AUTH: REFRESH ACCESS TOKEN
// ============================================================================
export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ error: "Refresh token is required.", code: "NO_REFRESH_TOKEN" });
  }

  try {
    const decoded = verifyRefreshToken(incomingRefreshToken);
    if (!decoded) {
      return res.status(403).json({ error: "Invalid or expired refresh token.", code: "INVALID_REFRESH_TOKEN" });
    }

    const user = await getUserByRefreshToken(incomingRefreshToken);
    if (!user || user.id !== decoded.id) {
      return res.status(403).json({ error: "Refresh token is no longer valid or revoked.", code: "TOKEN_REVOKED" });
    }

    // Issue fresh pair of tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update in database (Refresh Token Rotation)
    await updateUserRefreshToken(user.id, newRefreshToken);

    // Update cookies
    res.cookie("accessToken", newAccessToken, getCookieOptions(false));
    res.cookie("refreshToken", newRefreshToken, getCookieOptions(true));

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Internal token refresh error" });
  }
};

// ============================================================================
// 4. AUTH: LOGOUT USER
// ============================================================================
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await clearUserRefreshToken(userId);
    }

    // Clear cookies with exact options
    res.clearCookie("accessToken", getCookieOptions(false));
    res.clearCookie("refreshToken", getCookieOptions(true));

    res.status(200).json({ message: "Signed out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal logout error" });
  }
};

// ============================================================================
// 5. AUTH: GET CURRENT USER PROFILE (Protected)
// ============================================================================
export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await selectUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let extended = null;
    try {
      extended = await getUserFullDetailsByUserId(userId);
    } catch (e) {
      // Ignore
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        ...user,
        avatar: extended?.profileImg || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
        city: extended?.city || "",
        state: extended?.state || "",
        address: extended?.address || "",
        passportNumber: extended?.passportNumber || "",
        nationality: extended?.nationality || "",
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve user profile" });
  }
};

// ============================================================================
// 6. MANAGEMENT: GET ALL USERS
// ============================================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await selectAllUsers();
    res.status(200).json({ message: "Users retrieved successfully", users: users || [] });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve users" });
  }
};

// ============================================================================
// 7. MANAGEMENT: GET USER BY ID
// ============================================================================
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

// ============================================================================
// 8. MANAGEMENT: CREATE USER
// ============================================================================
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

// ============================================================================
// 9. MANAGEMENT: UPDATE USER BY ID
// ============================================================================
export const updateUserById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { fullname, name, email, phone, password, status, avatar, profileImg, location, city, state } = req.body;
  const userName = fullname || name;

  try {
    const existing = await selectUserById(id);
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

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

// ============================================================================
// 10. MANAGEMENT: DELETE USER BY ID
// ============================================================================
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

// ============================================================================
// 11. MANAGEMENT: DELETE ALL USERS
// ============================================================================
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
