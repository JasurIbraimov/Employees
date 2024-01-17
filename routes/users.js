const { Router } = require("express");
const { login, register, currentUser } = require("../controllers/users");

const router = Router();

// api/user/login
router.post("/login", login);

// api/user/register
router.post("/register", register);

// api/user/current
router.get("/current", currentUser);

module.exports = router;
