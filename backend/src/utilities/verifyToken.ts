import jwt from "jsonwebtoken";

export const verifyToken = (authorization: string | undefined) => {
  const headers = authorization;
  const token = headers && headers.split(" ")[1];

  if (!token) {
    return { message: "No token" };
  }

  let decoded: jwt.RoleJwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.RoleJwtPayload;
    return decoded;
  } catch (error) {
    return { message: "Invalid token" };
  }
};
