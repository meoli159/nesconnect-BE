const {fetchAllMessages, createMessage} = require("../controllers/message.controller");
const { verifyToken } = require("../middlewares/authJwt");
const router = require('express').Router();

router.get("/:communityId",verifyToken,fetchAllMessages);
router.post("/",verifyToken,createMessage);
module.exports = router;