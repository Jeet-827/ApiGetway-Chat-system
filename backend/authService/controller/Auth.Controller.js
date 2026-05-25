import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hash,
    });

    return res.status(201).json({
      message: "User registered",
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const pass = await bcrypt.compare(
      password,
      user.password
    );

    if (!pass) {
      return res.status(400).json({
        message: "Password is wrong",
      });
    }

    return res.status(200).json({
      message: "User logged in",
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};