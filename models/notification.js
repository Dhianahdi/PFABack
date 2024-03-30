const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  messages: [
    {
      type: String,
      required: true,
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;