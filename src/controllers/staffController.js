const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

/*
|--------------------------------------------------------------------------
| STAFF LOGIN
|--------------------------------------------------------------------------
*/
exports.login = async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.status(400).json({ message: "staffId and password required" });
    }

    const staff = await prisma.staff.findUnique({
      where: { staffId }
    });

    if (!staff) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, staff.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: staff.id,
      role: staff.role
    });

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL REQUESTS
|--------------------------------------------------------------------------
*/
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: { student: true }
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE REQUEST STATUS
|--------------------------------------------------------------------------
*/
exports.updateRequestStatus = async (req, res) => {
  res.json({ message: "Status updated" });
};

/*
|--------------------------------------------------------------------------
| SOFT DELETE REQUEST
|--------------------------------------------------------------------------
*/
exports.softDeleteRequest = async (req, res) => {
  res.json({ message: "Request deleted" });
};

/*
|--------------------------------------------------------------------------
| GET REQUEST HISTORY
|--------------------------------------------------------------------------
*/
exports.getRequestHistory = async (req, res) => {
  res.json({ message: "History fetched" });
};


