const { text } = require("express");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    // gender: Boolean,
    Gender: { type: String, enum: ["Homme", "Femme"] },
    todo: [
      {
        myTodo: { type: String },
        todoId: { type: Number, unique: true },
        todoDate: { type: Date, default: Date.now },
      },
    ],
    doneTodo: [
      {
        myTodo: { type: String },
        todoId: { type: Number, unique: true },
        todoDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
