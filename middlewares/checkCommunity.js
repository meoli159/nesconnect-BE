const db = require("../models");
const User = require("../models/user");
const { verifyToken } = require("./authJwt");
const Community = db.community;

isCommunityAdmin = async (req, res, next) => {
  Community.findById(req.params.communityId).exec((err, community) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    verifyToken(req, res, () => {
      if (req.user._id == community.communityAdmin._id) {
        next();
      } else {
        return res
          .status(403)
          .send({ message: "You Are NOT Allow To Do That!!" });
      }
    });
  });
};

checkCommunityAdminOrSameUser = async(req, res, next) => {
  verifyToken(req, res,async () => {
    const user = await User.findById({ _id: req.params.userId });
    let convertedUser = JSON.parse(JSON.stringify(user))
    console.log(convertedUser)
    if (req.user._id === convertedUser._id) {
      next();
    } else if (req.user._id !== convertedUser._id) {
      checkCommunity.isCommunityAdmin(req, res, next);
    } else {
      return res
        .status(403)
        .send({ message: "You Are NOT Allow To Do That!!!" });
    }
  });
};

checkDuplicateMember = async (req, res, next) => {
  verifyToken(req, res, async () => {
    isCommunityAdmin(req, res, async () => {
      const community = await Community.findById(req.params.communityId);
      if (!community)
        return res.status(403).send({ message: "No Community found" });
      const member = await User.findOne({ email: req.body.email });
      if (!member) return res.status(403).send({ message: "No user found" });

      const inCommunity = community.users.find((user) => {
        const communityUser = JSON.stringify(user);
        const memberId = JSON.stringify(member._id);
        return communityUser === memberId;
      });

      if (inCommunity) {
        return res
          .status(403)
          .send({ message: "User already in community!!!" });
      } else {
        next();
      }
    });
  });
};

const checkCommunity = {
  isCommunityAdmin,
  checkCommunityAdminOrSameUser,
  checkDuplicateMember,
};

module.exports = checkCommunity;
