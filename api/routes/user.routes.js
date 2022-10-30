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


module.exports = router;
