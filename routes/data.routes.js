const express = require("express");
const {getObjectives } = require("../controllers/data.controller");
const router = express.Router();

const prefix = "/objectives"
router.get(`${prefix}/getObjectives/`, getObjectives);

module.exports = router;