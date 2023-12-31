const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    ai: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    demo: { type: Boolean, default: false }, 
  },
  {
    timestamps: true,
  }
);

module.exports = model("Project", projectSchema);
