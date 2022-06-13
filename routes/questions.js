const express = require("express");
const {getAllQuestions,getProblem,addNewTag} = require("../controllers/problemscontroller");
const isAuth =require("../middlewares/isAuth");
const isNotAuth =require("../middlewares/isNotAuth");
const router = express.Router();

router.post("/questions",getAllQuestions);
router.get("/questions/:id",getProblem);
router.post("/questions/addNewTag/:id",addNewTag);

module.exports = router;
