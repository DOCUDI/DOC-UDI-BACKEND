const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let DocSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  clinic_address: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  //added city since needed for search in app
  city: {
    type: String,
    required: true,
  },
  //time slots will be a pair of from-to
  time_slots: [{
    _id: {
      type: String,
    },
    startTime:{
      type: String,
    },
    endTime:{
      type: String,
    }
  }],
  consultation_fee: {
    type: String,
    required: true,
  },
  working_days: [{
    type: String
  }],
  tokens: [{ type: Object }],
  isAdmin: Boolean,
});

DocSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

DocSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is mission, can not compare!");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};

DocSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) return false;

    return true;
  } catch (error) {
    console.log("error inside isThisEmailInUse method", error.message);
    return false;
  }
};

let Doc = mongoose.model("Admin", DocSchema);

module.exports = Doc;
