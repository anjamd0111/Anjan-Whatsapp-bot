const buckets = new Map();

// 5 commands per 10s per user
function check(jid, limit = 5, windowMs = 10_000) {
  const now = Date.now();
  const arr = (buckets.get(jid) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) { buckets.set(jid, arr); return false; }
  arr.push(now);
  buckets.set(jid, arr);
  return true;
}

module.exports = { check };
