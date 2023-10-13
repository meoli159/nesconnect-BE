const { verifyToken } = require("../middlewares/authJwt");
const { searchUser, deleteUser } = require("../controllers/user.controller");
const router = require("express").Router();

router.get("/", verifyToken, searchUser);

router.delete("/:userId",verifyToken, deleteUser);

module.exports = router;
