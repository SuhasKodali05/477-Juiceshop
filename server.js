const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PORT = 3000;
const publicDir = path.join(__dirname, 'public');
const salt = 'hw2b-demo-salt';
const storedHash = crypto.scryptSync('Password123!', salt, 64).toString('hex');
const user = { email: 'student@example.com', passwordHash: storedHash };
function validateLogin(email, password) {
  if (typeof email !== 'string' || !email.includes('@')) return 'Enter a valid email.';
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}
function sendJson(res, status, body) { res.writeHead(status, {'Content-Type':'application/json'}); res.end(JSON.stringify(body)); }
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {email, password} = JSON.parse(body || '{}');
        const error = validateLogin(email, password);
        if (error) return sendJson(res, 400, {success:false,error});
        const hash = crypto.scryptSync(password, salt, 64).toString('hex');
        if (email !== user.email || hash !== user.passwordHash) return sendJson(res, 401, {success:false,error:'Invalid email or password.'});
        sendJson(res, 200, {success:true,message:'Login successful.'});
      } catch { sendJson(res, 400, {success:false,error:'Invalid request.'}); }
    }); return;
  }
  const requested = req.url === '/' ? '/index.html' : req.url;
  const file = path.join(publicDir, path.normalize(requested));
  if (!file.startsWith(publicDir)) return sendJson(res, 403, {error:'Forbidden'});
  fs.readFile(file, (err, data) => {
    if (err) return sendJson(res, 404, {error:'Not found'});
    res.writeHead(200, {'Content-Type': file.endsWith('.html') ? 'text/html' : 'text/plain'}); res.end(data);
  });
});
server.listen(PORT, () => console.log(`HW 2B app running at http://localhost:${PORT}`));
