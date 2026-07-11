const rateLimit = require('express-rate-limit');

// Public endpoints (issue reporting) — 20 req / 15 min per IP
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' }
});

// AI triage — 10 req / 15 min per IP (expensive calls)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests, please try again later' }
});

module.exports = { publicLimiter, aiLimiter };
