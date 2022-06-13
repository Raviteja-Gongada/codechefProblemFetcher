const express = require("express");
const path = require("path");
const router = express.Router();
const {getInputForm,createProblem} = require("../controllers/createcontroller");
const isAuth = require("../middlewares/isAuth");
router.get("/createproblem", isAuth ,getInputForm);

router.post("/createproblem",isAuth,createProblem);

module.exports = router
