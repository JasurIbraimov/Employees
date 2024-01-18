const { Router } = require("express");
const auth = require("../middlewares/auth");
const {
  getAllEmployees,
  createEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
} = require("../controllers/employees");
const router = Router();

// /api/employees/
router.get("/", auth, getAllEmployees);

// /api/employees/
router.post("/", auth, createEmployee);

// /api/employees/:id
router.get("/:id", auth, getEmployee);

// /api/employees/:id
router.delete("/:id", auth, deleteEmployee);

// /api/employees/:id
router.put("/:id", auth, updateEmployee);

module.exports = router;
