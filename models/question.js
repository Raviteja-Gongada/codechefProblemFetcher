const mongoose = require("mongoose");

const ProblemSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  challengeType: {
    type: String,
  },
  dateAdded: {
    type: String,
  },
  languagesSupported: {
    type: Array,
  },
  maxTimeLimit: {
    type: String,
  },
  problemCode: {
    type: String,
  },
  partialSubmissions: {
    type: String,
  },
  sourceSizeLimit: {
    type: String,
  },
  tags: {
    type: Array,
  },
  userDefinedTags: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      tags: {
        type: Array,
        required: true,
      },
    },
  ],
  totalSubmissions: {
    type: String,
  },
  problemName: {
    type: String,
    required: true,
  },
  successfulSubmissions: {
    type: String,
  },
  accuracy: {
    type: String,
  },
});

module.exports = mongoose.model("questions", ProblemSchema);
