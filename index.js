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
            console.log(req.headers.host, req.url);
            const domain = parse_param(req.url, 'domain') || req.headers.host.split('.').slice(1).join('.');
            console.log('set-domain', domain);
            const parsed_cookie = cookie.parse(req.headers.cookie || '', {
                decode: str => str, // 不对 cookie 值进行任何改动
            });
            const new_cookies = Object.entries(parsed_cookie).reduce((acc, [key, value]) => acc.concat(cookie.serialize(key, value, {
                domain,
                sameSite: 'none',
                secure: true,
            })), [])
            console.log(new_cookies);
            res.setHeader("set-cookie", new_cookies);
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
