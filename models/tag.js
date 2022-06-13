const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("tag", TagSchema);
