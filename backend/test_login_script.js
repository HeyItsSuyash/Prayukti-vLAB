const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'test.student@mmmut.ac.in',
            password: 'password123'
        });
        console.log('Login Success:', response.data.message);
        console.log('Token exists:', !!response.data.token);
    } catch (err) {
        console.error('Login Failed:', err.response ? err.response.data : err.message);
    }
}

testLogin();
