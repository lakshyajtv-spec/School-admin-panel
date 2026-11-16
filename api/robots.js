module.exports = (req, res) => {
  const forwarded = req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.headers.host || "").split(",")[0].trim();
  if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host)) return res.status(400).send("Invalid host");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.status(200).send(`User-agent: *\nAllow: /\nDisallow: /Lakshya-admin\nDisallow: /Lakshya-admin/\nSitemap: https://${host}/sitemap.xml\n`);
};
