
const sql = require('mssql');
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: process.env.NODE_ENV !== 'production', 
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log(`Connected to SQL Server (${process.env.NODE_ENV} environment)`);
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        console.error('Error details:', err);
    });

module.exports = {
    sql,
    poolPromise,
};