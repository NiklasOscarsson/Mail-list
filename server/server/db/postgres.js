const { Client }=require('pg');
require('dotenv').config()


require('../serverFunctions/week')


date = new Date

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASS,
  port: process.env.PGPORT,
})





module.exports = {client}