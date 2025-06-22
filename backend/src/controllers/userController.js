import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please fill all input fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    // Create a token for the new user
    createToken(res, newUser._id);

    res.status(201).json({
      message: "User created successfully",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please fill all input fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a token for the user
    createToken(res, user._id);

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 0, // Set maxAge to 0 to delete the cookie
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during logout",
      error: error.message,
    });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from the response
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving users",
      error: error.message,
    });
  }
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving user profile",
      error: error.message,
    });
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (username || email) {
      user.username = username || user.username;
    }
    if (email) {
      user.email = email || user.email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = (await bcrypt.hash(password, salt)) || user.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating user profile",
      error: error.message,
    });
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    if (user.isAdmin) {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error.message,
    });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving user",
      error: error.message,
    });
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (username || email) {
      user.username = username || user.username;
    }
    if (email) {
      user.email = email || user.email;
    }
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin || user.isAdmin;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating user",
      error: error.message,
    });
  }
});

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
