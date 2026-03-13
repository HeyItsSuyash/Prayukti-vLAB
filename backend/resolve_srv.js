const dns = require('dns').promises;

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function resolveSRV() {
    try {
        const records = await dns.resolveSrv('_mongodb._tcp.cluster0.uxl7hxw.mongodb.net');
        console.log('SRV_RECORDS:', JSON.stringify(records, null, 2));
    } catch (err) {
        console.error('RESOLVE_ERROR:', err);
    }
}

resolveSRV();
