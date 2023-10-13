const db = require("../models");
const Message = db.message;

const fetchAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ community: req.params.communityId })
      .populate("sender")
      .populate("community")
      .lean()
      .exec()
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(400).send(error.messages);
  }
};

const createMessage = async (req, res) => {
  const { content, communityId } = req.body;
  if (!content || !communityId) {
    return res.status(400).send({ message: "Invalid data passed into request" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    community: communityId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await Message.findOne({ _id: message._id })
      .populate("sender")
      .populate("community");
    return res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  fetchAllMessages,
  createMessage,
};
