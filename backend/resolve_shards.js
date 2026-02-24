const dns = require('dns').promises;

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function resolveShards() {
    try {
        const srvRecords = await dns.resolveSrv('_mongodb._tcp.cluster0.uxl7hxw.mongodb.net');
        console.log('SRV_RECORDS:', JSON.stringify(srvRecords, null, 2));

        const shardData = [];
        for (const record of srvRecords) {
            const ips = await dns.resolve4(record.name);
            shardData.push({
                hostname: record.name,
                ip: ips[0],
                port: record.port
            });
        }
        console.log('SHARD_DATA:', JSON.stringify(shardData, null, 2));
    } catch (err) {
        console.error('RESOLVE_ERROR:', err);
    }
}

resolveShards();
