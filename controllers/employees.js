const { prisma } = require("../prisma/prisma-client");
const messages = require("../messages");
/**
 * @route GET /api/employees/
 * @desc Get all employees of current user
 * @access Private
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

/**
 * @route POST /api/employees/
 * @desc Create an employee for current user
 * @access Private
 */
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, age, address } = req.body;

    if (
      !firstName ||
      !firstName.trim() ||
      !lastName ||
      !lastName.trim() ||
      !age ||
      !age.trim() ||
      !address ||
      !address.trim()
    ) {
      return res.status(400).json({ message: messages.REQUIRED_MESSAGE });
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        age,
        address,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

/**
 * @route GET /api/employees/:id
 * @desc Get employee of current user by ID
 * @access Private
 */
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.trim()) {
      return res.status(404).json({ message: messages.NOT_FOUND });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: messages.NOT_FOUND });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

/**
 * @route DELETE /api/employees/:id
 * @desc Delete current users' employee by ID
 * @access Private
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.trim()) {
      return res.status(404).json({ message: messages.NOT_FOUND });
    }

    const employee = await prisma.employee.delete({
      where: {
        id,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: messages.NOT_FOUND });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

/**
 * @route UPDATE /api/employees/:id
 * @desc Update current users' employee by ID
 * @access Private
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.trim()) {
      return res.status(404).json({ message: messages.NOT_FOUND });
    }

    const employee = await prisma.employee.update({
      where: {
        id,
      },
      data: req.body,
    });

    if (!employee) {
      return res.status(404).json({ message: messages.NOT_FOUND });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.SERVER_ERROR });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
};
