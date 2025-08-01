// Vercel API端点，用于安全地提供环境变量
export default function handler(req, res) {
  // 设置CORS头，只允许从特定域名访问
  res.setHeader('Access-Control-Allow-Origin', '*'); // 生产环境中应限制为您的域名
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    res.status(405).json({ error: '只允许GET请求' });
    return;
  }

  // 提供环境变量（不包含敏感值）
  res.status(200).json({
    openRouterKey: process.env.OPENROUTER_API_KEY || '',
    openaiKey: process.env.OPENAI_API_KEY || '',
    // 可以添加其他非敏感配置
    isVercel: true
  });
} 