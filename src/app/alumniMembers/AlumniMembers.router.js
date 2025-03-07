const express = require('express');
const { createAlumniMembers, getAlumniMembers, updateAlumniMemberStatus } = require('./alumniMembers.controller');
const router = express.Router()

router.post('/create', createAlumniMembers)
router.get("/getalumniMembers", getAlumniMembers )
router.put("/alumni/:id", updateAlumniMemberStatus);


module.exports = router;