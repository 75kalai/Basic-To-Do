const mysql = require('mysql2');
require('dotenv').config();

var dbEnvVar = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

const pool = mysql.createPool(dbEnvVar).promise();

async function insertRow( table, columns, values ){
    var temp = "";
    for(i=0; i< values.length-1; i++){
        temp+="?,";
    }
    temp+="?";

    const [row] = await pool.query(`insert into ${table} (${columns.toString()}) values (${temp})`, values);
    return row;
}

async function getRow( table, condition, columns="*"){
    const [row] = await getRows( table, condition, columns );
    return row;
}

async function getRows( table, condition, columns="*" ){

    let query = `select ${ columns==="*" ? "*" : columns.toString() } from ${table} ${condition=="*"?"":` where ${condition}`}`;
    // console.log(query);
    const rows = await pool.query( query);
    // console.log("\n--\n",rows,"\n--\n");
    return rows[0];

}

async function updateRows( table, condition, columns, values ){
    let colVals="";
    for(i=0;i<columns.length;i++){
        colVals+=`${columns[i]}="${values[i]}", `;
    }
    let query = `update ${table} set ${colVals} where ${condition}`;
    const [row] = await pool.query( query );
    return row;
}


async function executeQuery( query, variables ){
    const [row] = await pool.query( query, variables );
    return row;
}

module.exports = { dbEnvVar, pool, insertRow, getRow, getRows, updateRows, executeQuery };
