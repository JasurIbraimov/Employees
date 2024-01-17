const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const messages = require("./constants");
/**
 *
 * @route POST /api/user/login
 * @desc Login user with email and password
 * @access Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ message: messages.REQUIRED_MESSAGE });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

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
};

/**
 *
 * @route POST /api/user/register
 * @desc Register user
 * @access Public
 */
const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email.trim() || !password.trim() || !name.trim()) {
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
  const hashedPassword = bcrypt.hash(password, salt);

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
      id: user.id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
    });
  }
  return res.status(400).json({ message: messages.REGISTER_ERROR });
};

const currentUser = async (req, res) => {
  res.send("current user");
};

module.exports = {
  login,
  register,
  currentUser,
};
