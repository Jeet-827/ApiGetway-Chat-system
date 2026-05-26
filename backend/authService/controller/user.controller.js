import User from "../models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const users = await User.find(
      currentUserId ? { _id: { $ne: currentUserId } } : {},
      "_id username email"
    );

    return res.status(200).json({
      users,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};