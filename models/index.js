const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.user = require("./user");
db.community = require("./community");
db.message = require("./message");

module.exports = db;
