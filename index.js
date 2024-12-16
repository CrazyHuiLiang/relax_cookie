const http = require('http');
const cookie = require('cookie');

// 解析url中的参数，参数不存在时返回null
function parse_param(url, name) {
    const reg = new RegExp(`${name}=(?<value>[^&?]+)`, 'ig');
    const result = reg.exec(url);
    if (!result) {
        return null;
    }
    return result.groups.value;
}

function start_serve(port = 80) {
    const server = http.createServer((req, res) => {
        try {
            const domain = parse_param(req.url, 'domain');
            const parsed_cookie = cookie.parse(req.headers.cookie || '');
            const new_cookies = Object.entries(parsed_cookie).reduce((acc, [key, value]) => acc.concat(decodeURIComponent(cookie.serialize(key, value, {
                domain: domain || req.headers.host.split('.').slice(1).join('.'),
                sameSite: 'none',
                secure: true,
            }))), [])
            res.setHeader("Set-Cookie", new_cookies);
            res.write(new_cookies.map(s => 'Set-Cookie: ' + s).join('\n\n'));
            return res.end('\n\n\n\n\nFinish');
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
