const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    list: {
      type: String,
      required: true,
    },
   status:{
    type:Boolean,
    required:true
   }
  },
  {
    timestamps: true,
  }
);

const todoModel = mongoose.model("todoModel", todoSchema);

module.exports = todoModel;
