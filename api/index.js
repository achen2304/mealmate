module.exports = (req, res) => {
  // Get the origin from the request
  const origin = req.headers.origin;

  // Set CORS headers - allow all origins in production
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log request details for debugging
  console.log(`API request received: ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  res.status(200).json({
    status: 'ok',
    message: 'MealMate API is running',
    serverless: true,
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
  });
};
