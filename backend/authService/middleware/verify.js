import jwt from "jsonwebtoken"

export const verify = async (req, res, next) => {
  let token = null;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not found", status: 401 });
    }

    token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token", status: 401 });
    }

    req.user = decode;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error.message);
    return res.status(401).json({ message: `Unauthorized: ${error.message}`, status: 401 });
  }
}