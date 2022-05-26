const express = require("express");
const {getObjectives } = require("../controllers/page_1");
const router = express.Router();

const prefix = "/page1"
router.get(`${prefix}/getData/`, getObjectives);

module.exports = router;