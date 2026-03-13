const { MongoClient } = require('mongodb');
const dns = require('dns').promises;

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://Vaibhav:Singh123@cluster0.uxl7hxw.mongodb.net/prayuktiVlab?retryWrites=true&w=majority";

async function getReplicaSetInfo() {
    // We can't easily use mongodb+srv with custom dns in the driver without system changes
    // But we can resolve the hosts manually and connect to one to get the RS name
    try {
        const srvRecords = await dns.resolveSrv('_mongodb._tcp.cluster0.uxl7hxw.mongodb.net');
        const firstShard = srvRecords[0].name;
        const ips = await dns.resolve4(firstShard);
        const shardIp = ips[0];

        console.log(`Connecting to shard ${firstShard} (${shardIp}) to get RS name...`);

        // Connect directly to one node (no SRV)
        const directUri = `mongodb://Vaibhav:Singh123@${shardIp}:27017/prayuktiVlab?tls=true&tlsAllowInvalidHostnames=true&authSource=admin`;

        const client = new MongoClient(directUri);
        await client.connect();
        const isMaster = await client.db('admin').command({ isMaster: 1 });
        console.log('REPLICA_SET_NAME:', isMaster.setName);
        await client.close();
    } catch (err) {
        console.error('CONNECT_ERROR:', err);
    }
}

getReplicaSetInfo();
