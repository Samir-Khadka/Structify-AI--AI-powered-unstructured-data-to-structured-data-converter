
const http = require('http');

const run = async () => {
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Register
    console.log('Testing Registration...');
    const regData = JSON.stringify({ email, password, name: 'Test User' });

    const regReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': regData.length
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Registration Status:', res.statusCode);
            console.log('Registration Body:', data);

            if (res.statusCode === 200) {
                // 2. Login
                console.log('\nTesting Login...');
                const loginData = JSON.stringify({ email, password });
                const loginReq = http.request({
                    hostname: 'localhost',
                    port: 3000,
                    path: '/api/auth/login',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': loginData.length
                    }
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        console.log('Login Status:', res.statusCode);
                        console.log('Login Body:', data);
                    });
                });
                loginReq.write(loginData);
                loginReq.end();
            }
        });
    });

    regReq.on('error', (e) => {
        console.error('Request error:', e.message);
    });

    regReq.write(regData);
    regReq.end();
};

run();
