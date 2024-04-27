const express = require("express");
const { userModel } = require("../models/user.schema");
const { blacklistModel } = require("../models/blacklist.schema");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User has been registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
userRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, email, password: hash });
    await newUser.save();
    res
      .status(201)
      .send({
        message: "User has been registered successfully",
        user: newUser,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with username and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Wrong credentials. Please enter the correct password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found. Please try signing up.");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).send("Error comparing passwords.");
      }
      if (!result) {
        return res
          .status(401)
          .send("Wrong credentials. Please enter the correct password.");
      }
      const jwt_token_payload = { userId: user._id };
      // eslint-disable-next-line no-undef
      const token = jwt.sign(jwt_token_payload, process.env.secretKey, { expiresIn: '1h' });
      res.status(200).send({ message: "Login successful", token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout by invalidating token
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: JWT token to invalidate
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
userRouter.post("/logout", async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const newBlacklistToken = new blacklistModel({ token, expiresAt: new Date() });
    await newBlacklistToken.save();

    res.status(200).send("Logout successful.");
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
