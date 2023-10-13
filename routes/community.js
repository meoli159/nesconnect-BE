const {getCommunity,createCommunity,renameCommunity,deleteCommunity,addUserToCommunity, removeUserFromCommunity, transferCommunityAdmin} = require("../controllers/community.controller");

const { verifyToken } = require("../middlewares/authJwt");

const { checkCommunity } = require("../middlewares");
const router = require('express').Router();

router.get("/",verifyToken,getCommunity)
router.post("/",verifyToken, createCommunity)
router.put("/:communityId",checkCommunity.isCommunityAdmin,renameCommunity);
router.delete("/:communityId",checkCommunity.isCommunityAdmin,deleteCommunity);

router.post("/:communityId/user",checkCommunity.checkDuplicateMember,addUserToCommunity);
router.delete("/:communityId/user/:userId",checkCommunity.checkCommunityAdminOrSameUser,removeUserFromCommunity);
router.put("/:communityId/user",checkCommunity.isCommunityAdmin,transferCommunityAdmin)
module.exports = router;