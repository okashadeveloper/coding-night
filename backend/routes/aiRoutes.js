const express = require('express');
const { triageIssue } = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public route - anyone can use AI triage for suggestions
router.post('/triage', aiLimiter, triageIssue);

module.exports = router;
