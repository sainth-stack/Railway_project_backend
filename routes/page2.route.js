const express = require("express");
const {getObjectives } = require("../controllers/page_2");
const router = express.Router();

const prefix = "/page2"
router.get(`${prefix}/getData/`, getObjectives);

module.exports = router;