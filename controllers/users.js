const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const messages = require("../messages");
/**
 * @route POST /api/user/login
 * @desc Login user with email and password
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password || !password.trim()) {
      return res.status(400).json({ message: messages.REQUIRED_MESSAGE });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: messages.UNKNOWN_USER });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    const secret = process.env.JWT_SECRET;

    if (user && isPasswordCorrect && secret) {
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    }
    return res.status(400).json({ message: messages.LOGIN_ERROR });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

/**
 * @route POST /api/user/register
 * @desc Register user
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (
      !email ||
      !email.trim() ||
      !password ||
      !password.trim() ||
      !name ||
      !name.trim()
    ) {
      return res.status(400).json({ message: messages.REQUIRED_MESSAGE });
    }
    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registeredUser) {
      return res.status(400).json({ message: messages.ALREADY_REGISTERED });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const secret = process.env.JWT_SECRET;

    if (user && secret) {
      return res.status(201).json({
        name: user.name,
        email: user.email,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    }
    return res.status(400).json({ message: messages.REGISTER_ERROR });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

/**
 * @route GET /api/user/current
 * @desc Get current logged user
 * @access Private
 */
const currentUser = async (req, res) => {
  try {
    const secret = process.env.JWT_SECRET;
    const user = req.user;

    if (!secret && !user) {
      return res.status(400).json({ message: messages.UNAUTHORIZED });
    }
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

module.exports = {
  login,
  register,
  currentUser,
};
