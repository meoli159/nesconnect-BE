
const {logout,login,register,updateUser, forgotPassword, resetPassword, confirmResetPassword} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authJwt");
const router = require('express').Router();


router.post("/register",register);
router.post("/login", login);
router.put("/",verifyToken ,updateUser)
router.post("/logout",verifyToken,logout);

router.post("/forgotpassword",forgotPassword);
router.post("/resetpassword/:userId/:forgotPasswordToken",resetPassword);


module.exports = router;
