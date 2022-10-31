const { adminController } = require("../controllers");

const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middlewares/validation/user");

router.post("/create-doc", (req, res) => {
  adminController.createDoc(req, res);
});
router.post(
  "/sign-in-doc",
  validateUserSignIn,
  userValidation,
  (req, res) => {
    adminController.docSignIn(req, res);
  }
);
router.post("/sign-out", isAuth, (req, res) => {
  adminController.signOut(req, res);
});
router.post("/upload-prescription", (req, res) => {
  adminController.uploadPrescription(req, res);
});
router.post("/upcoming-appointments", (req, res) => {
  adminController.upcomingAppointment(req, res);
});


module.exports = router;
