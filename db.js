const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Nabeel30',
    server: 'NABEELS-WORK',
    database: 'NodeJsTestDb',
    options: {
        encrypt: false
    }
};



const pool = new sql.ConnectionPool(config);

pool.connect().then(() => {
    console.log('Connected to SQL Server');
}).catch(err => {
    console.log('Error connecting to SQL Server:', err);
});

module.exports = pool;