const exp = require('express');
const Mail = require('./resources/js/mail');
const {client, setup} = require('./resources/js/postgres')
require('./resources/js/week')
require('dotenv').config();
const cors = require('cors')
const app = exp();
const mail = new Mail()

/* 
setInterval(async ()=>{
  await mail.updateMailTemplate() //text then HTML
  mail.sendMail()
}, 1000*60*60*24*7)
*/

app.use(cors())
app.use(exp.urlencoded({extended:true}));
app.use(exp.static('resources'));
app.use(exp.json())

app.get('/', (req,res)=>{
  res.sendFile('index.html', {root:'./views/'})
})

app.get('/confirm/test', async (req,res)=>{
  await mail.updateMailTemplate()
  mail.sendConfimationMailTest()
  res.send('mail sent to '+ mail.to)
})

app.get('/confirm/real', async (req,res)=>{
  await mail.updateMailTemplate()
  mail.sendConfimationMail()

  res.send('mail sent to '+ mail.to)
})

app.get('/admin/setup/db', (req,res)=>{
  setup(res)
})


app.post('/setSubject',async (req,res)=>{
  console.log('this far1');
  let date = new Date
  let thisWeek = date.getWeek()
  console.log('this far2');
  await client.query(`
        INSERT INTO reports (week, subject, report, teacher)
        VALUES ($1, $2, $3, $4);`, 
        [thisWeek, req.body.subject, req.body.text, req.body.teacher])
  .then(()=>{res.send('Insert completed')})
  .catch((err)=>{
    console.log(err);
    res.send(`Error occured`);
  })
})

app.listen(80, (error)=>{
  if(error){
    console.log(error);
  }else{
    console.log('Connected');
  }
})