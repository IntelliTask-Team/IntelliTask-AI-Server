const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Task", taskSchema);
