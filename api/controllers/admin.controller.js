const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Doc } = require("../models");

// creating new admin
const createDoc = async (req, res) => {
  console.log("helo");
  const { name, email, password, clinic_address, specialization, city, time_slots, consultation_fee, working_days } = req.body;
  const isNewUser = await Doc.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });
  const user = await Doc({
    name,
    email,
    password,
    clinic_address,
    specialization,
    city,
    time_slots,
    consultation_fee,
    working_days
  });
  await user.save();
  res.json({ success: true, user });
};

// sign-in new admin
const docSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await Doc.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found, with the given email!",
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: "email / password does not match!",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  let oldTokens = user.tokens || [];

  if (oldTokens.length) {
    oldTokens = oldTokens.filter((t) => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return t;
      }
    });
  }

  await Doc.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });

  const userInfo = {
    fullname: user.name,
    email: user.email,
  };

  res.json({ success: true, user: userInfo, token });
};

// sign-out route for admin
const signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization fail!" });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    await Doc.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: "Sign out successfully!" });
  }
};

const uploadPrescription = async (req, res) => {

}


const upcomingAppointment = async (req, res) => {

}



module.exports = {
  createDoc,
  docSignIn,
  signOut,
  uploadPrescription,
  upcomingAppointment
};
