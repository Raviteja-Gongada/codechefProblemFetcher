const express = require("express");
const {getAllTags} = require("../controllers/tagscontroller");
const isAuth =require("../middlewares/isAuth");
const isNotAuth =require("../middlewares/isNotAuth");
const router = express.Router();

router.get("/home",getAllTags);

module.exports = router;