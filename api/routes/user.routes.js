const { userController } = require("../controllers");
const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middlewares/validation/user");

router.post("/create-user", (req, res) => {
  console.log("yo");
  userController.createUser(req, res);
});
router.post("/sign-in", validateUserSignIn, userValidation, (req, res) => {
  userController.userSignIn(req, res);
});
router.post("/sign-out", isAuth, (req, res) => {
  userController.signOut(req, res);
});
router.post("/book-appointment", (req, res) => {
  userController.bookAppointment(req, res);
});
router.post("/previous-appointment", (req, res) => {
  userController.previousAppointments(req, res);
});
router.post("/upcoming-appointment", (req, res) => {
  userController.upcomingAppointments(req, res);
});
router.post("/start-appointment", (req, res) => {
  userController.startAppointment(req, res);
});
router.post("/get-doc-specialization", (req, res) => {
  userController.getDoctorBySpecialization(req, res);
});
router.get("/get-docs", (req, res) => {
  userController.getAllDoctors(req, res);
});


module.exports = router;
