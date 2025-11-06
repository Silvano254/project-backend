// Placeholder for auth middleware. Integrate JWT/session later.
function requireAuth(req, res, next) {
  // TODO: Verify token or session here.
  // For now, pass through so development/testing isn't blocked.
  return next();
}

module.exports = { requireAuth };
