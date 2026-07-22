const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_4H3QzITVdmyq@ep-delicate-dust-a517b6is-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => {
  return client.query('SELECT role FROM "User" WHERE "loginId" = $1', ['ADM001']);
}).then(res => {
  console.log(res.rows);
}).catch(console.error).finally(() => {
  client.end();
});
