const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User, Doc, Appointment } = require("../models");

// creating new admin
const createDoc = async (req, res) => {
  console.log("in createDoc");
  const currentAppointment = [];
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
    working_days,
    currentAppointment
  });
  await user.save();
  res.json({ success: true, user, password });
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

  res.json({ success: true, user, token });
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

//to upload prescrition by doctor
const uploadPrescription = async (req, res) => {
  const { docID, patientID, docName, specialization, clinicAddress, patientName, date, time, fees, prescription } = req.body;

  let medicalHistory = [];
  await User.findById(patientID, (err, userData) => {
    if(!userData || err){
      console.log(err);
      res.json({ success: false, message: "error while finding user" });
      return;
    }
    else{
      medicalHistory = userData.medicalHistory;
    }
  });

  const newPrescription = {
    docName: docName,
    specialization: specialization,
    clinicAddress: clinicAddress,
    patientName: patientName,
    date: date,
    time: time,
    fees: fees,
    prescription: prescription,
  }

  medicalHistory.push(newPrescription);

  await User.updateOne({ _id: patientID }, 
    { medicalHistory },
    function (err, updateRes) {
    if (err){
        console.log(err);
        res.json({ success: false, message: "error while updating user" });
    }
    else{
        console.log("Updated user medical history");
    }
  });

  await Appointment.findOne({ patientID, date, time_slot:time }, async (err, userData) => {
    if(!userData || err){
      console.log(err);
      res.json({ success: false, message: "error while finding user in appointments" });
      return;
    }
  });

  await Appointment.deleteOne({ patientID, date, time_slot:time }, function(err, result) {
    if (!result || err) {
      console.log(err); 
      res.json({ success: false, message: "error while deleting from appointment array" });
      return;
    } else {
      console.log("Data deleted from appointments");
    }
  });


  await Doc.findById(docID, (err, docData) => {
    if(!docData || err){
      console.log(err);
      res.json({ success: false, message: "error while finding doctor" });
      return;
    }
  });

  await Doc.updateOne({ _id: docID }, { currentAppointment: [] }, (err, docs) => {
    if (err){
      console.log(err);
      res.json({ success: false, message: "error while updating doctor" });
      return;
    }
    else{
      console.log("Updated doc, emptied the currentAppointment array");
      res.json({ success: true, docs });
    }
  });

}

//get upcoming appointments for doctor to take
const upcomingAppointment = async (req, res) => {
  const pid = req.body.id;
  await Appointment.find({ docID: pid }, (err, upAppointments) => {
    if(upAppointments.length === 0 || err){
      console.log(err);
      res.json({ success: false, message: "error in finding upcoming appointments" });
    }
    else{
      console.log("upcoming appointments of patient given");
      res.json({ success: true, upAppointments });
    }
  })
}


//start appointment
//and return patient history if found
const startAppointment = async (req, res) => {
  const did = req.body.docID;
  let currentAppointment = [];
  let temp = false;

  await Doc.findById(did, (err, doc) => {
    if(!doc || err){
      console.log(err);
      res.json({ success: false, message: "error in finding doctor" });
      return;
    }
    else{
      // console.log(doc);
      temp = true;
      currentAppointment = doc.currentAppointment;
    }
  });
  // console.log(currentAppointment);

  if(currentAppointment.length === 0){
    if(temp){
      console.log("no current appointments");
      res.json({ success: true, currentAppointment });
    }
    return;
  }

  else{
    const pid = currentAppointment[0].patientID;

    User.findById(pid, (err, prevAppointments) => {
      if(!prevAppointments || err){
        console.log(err);
        res.json({ success: false, message: "error in finding medical history" });
      }
      else{
        console.log("medical history of patient given")
        const medicalHistory = prevAppointments.medicalHistory;
        res.json({ success: true, currentAppointment, medicalHistory });
      }
    });
  }

}


module.exports = {
  createDoc,
  docSignIn,
  signOut,
  uploadPrescription,
  upcomingAppointment,
  startAppointment,
};
