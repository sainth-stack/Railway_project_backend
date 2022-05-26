const express = require("express");
const {getObjectives } = require("../controllers/page_3");
const router = express.Router();

const prefix = "/page3"
router.get(`${prefix}/getData/`, getObjectives);

module.exports = router;