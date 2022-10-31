const mongoose = require("mongoose");

//check time slot 
const AppointmentModel = mongoose.Schema(
  {
    docName: {
      type: String,
      required: true
    },
    docID: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true
    },
    patientID: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time_slot: {
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentModel);
module.exports = Appointment;