import jwt from "jsonwebtoken";


/**
 * User Authentication Middleware
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {import("express").NextFunction} next Next function 
 * @returns {Boolean} true if authenticated otherwise false
 */
export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    if (!token) {
      return res.status(401).json({ errors: [{ message: "Unauthenticated." }] });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ errors: [{ message: "Invalid Auth Token" }] });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
  }

};