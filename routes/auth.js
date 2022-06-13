const express = require("express");
const {logout,postSignUp,postLogin,getLogin,getSignUp} = require("../controllers/authcontroller");
const isAuth =require("../middlewares/isAuth");
const isNotAuth =require("../middlewares/isNotAuth");

const router = express.Router();

router.get("/login",isNotAuth,getLogin);

router.get("/signup",isNotAuth, getSignUp);

router.post("/signup",isNotAuth, postSignUp);
router.post("/login",isNotAuth,postLogin)

router.get("/logout",isAuth, logout)

module.exports = router;
