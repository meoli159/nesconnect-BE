const db = require("../models");
const ROLES = db.role;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // check username
    User.findOne({
        username: req.body.username,
    }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // check email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail//,
    //checkRolesExisted
};

module.exports = verifySignUp;