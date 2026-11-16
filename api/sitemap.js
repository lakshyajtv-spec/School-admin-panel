function requestHost(req) {
  const forwarded = req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.headers.host || "").split(",")[0].trim();
  return /^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host) ? host : null;
}

module.exports = (req, res) => {
  const host = requestHost(req);
  if (!host) return res.status(400).send("Invalid host");
  const origin = `https://${host}`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>`);
};
