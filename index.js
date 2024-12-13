const http = require('http');
const cookie = require('cookie');

function start_serve(port = 80) {
    const server = http.createServer((req, res) => {
        try {
            const parsed_cookie = cookie.parse(req.headers.cookie);
            const new_cookies = Object.entries(parsed_cookie).reduce((acc, [key, value]) => acc.concat(cookie.serialize(key, value, {
                sameSite: 'none',
                secure: true,
            })), [])
            res.setHeader("Set-Cookie", new_cookies);
            res.write(new_cookies.map(s => 'Set-Cookie: ' + s).join('\n\n'));
            return res.end('所有');
        } catch (e) {
            return res.end('500 error: ' + e.message);
        }
    });
    server.on('listening', () => {
        console.log('server start at:', port);
    });
    server.listen(port);
}

start_serve();
