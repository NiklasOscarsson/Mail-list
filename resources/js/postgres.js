const { Client }=require('pg');
require('dotenv').config()

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PGPASS,
  port: process.env.PORT,
})
/* 
class pgClient{
  constructor(){
    this.client = new Client({
      user: process.env.PGUSER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PGPASS,
      port: process.env.PORT,
    })
  }
  async connect(){
    await this.client.connect((res)=>{console.log(res);})
    this.query()
  }
  query(query='SELECT * from Reports'){
    console.log('trying query');
    this.client.query(`${query}`, (err, res) => {
      console.log(err, res)
    })
  }
  endConnection(){
    this.client.end()
  }
}

 */





module.exports = client