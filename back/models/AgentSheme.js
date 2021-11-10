const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  licenseId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Agent", AgentSchema);
