const db = require("../models");
const User = db.user;
const Community = db.community;

const getCommunity = async (req, res) => {
  try {
    await Community.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users")
      .populate("communityAdmin")
      .sort({ createdAt: -1 })
      .then((results) => {
        res.status(200).send(results);
      });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const createCommunity = (req, res) => {
  if (!req.user) {
    return res.status(404).send({ message: "User Not found." });
  }
  const community = new Community({
    communityName: req.body.communityName,
    communityAdmin: req.user,
    users: req.user,
  });
  community.save((err, community) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.status(200).send({
        community,
      });
    }
  });
};

//edit community
const renameCommunity = async (req, res) => {
  try {
    const { communityName } = req.body;
    const updatedCommunity = await Community.findByIdAndUpdate(
      req.params.communityId,
      {
        communityName: communityName,
      },
      {
        new: true,
      }
    )
      .populate("users")
      .populate("communityAdmin");

    if (!updatedCommunity)
      return res.status(401).send({ message: "Community Not Found" });
    else {
      res.json(updatedCommunity);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

//delete community
const deleteCommunity = async (req, res) => {
  try {
    const deleted = await Community.findByIdAndDelete(req.params.communityId);

    return res.json(deleted);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//add user to community
const addUserToCommunity = async (req, res) => {
  try {
    const email = await User.findOne({ email: req.body.email });
    const added = await Community.findByIdAndUpdate(
      req.params.communityId,
      {
        $push: { users: email },
      },
      {
        new: true,
      }
    )
      .populate("users")
      .populate("communityAdmin");
    if (!added)
      return res.status(404).send({ message: "Community Not Found!!" });
    else {
      res.json({ community: added, user: email });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

//remove user from community
const removeUserFromCommunity = async (req, res) => {
  try {
    const {userId,communityId} = req.params
    const user = await User.findById(userId);
    const removed = await Community.findByIdAndUpdate(
      communityId,
      {
        $pull: { users:user._id},
      },
      {
        new: true,
      }
    )
      .populate("users")
      .populate("communityAdmin");
      
    if (!removed)
      return res.status(404).send({ message: "Community Not Found!!" });
    else {
      res.json({ community: removed, user: user });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

//transfer community admin
const transferCommunityAdmin = async (req, res) => {
  const { userId } = req.body;
  const newCommunityAdmin = await User.findById(userId);
  const updatedCommunity = await Community.findByIdAndUpdate(
    req.params.communityId,
    {
      communityAdmin: newCommunityAdmin,
    },
    { new: true }
  )
    .populate("users")
    .populate("communityAdmin");

  if (!updatedCommunity)
    return res.status(401).send({ message: "Community Not Found" });
  else {
    res.json(updatedCommunity);
  }
};
module.exports = {
  getCommunity,
  createCommunity,
  renameCommunity,
  deleteCommunity,
  addUserToCommunity,
  removeUserFromCommunity,
  transferCommunityAdmin,
};
