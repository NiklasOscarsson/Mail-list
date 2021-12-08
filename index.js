const exp = require('express');
const Mail = require('./resources/js/mail');
const {client, setup} = require('./resources/js/postgres')
require('./resources/js/week')
require('dotenv').config();
const cors = require('cors')
const cron = require('node-cron')
const app = exp();
const mail = new Mail()

cron.schedule('0 8 * * 1' , ()=>{
  mail.sendReminderMail()
  console.log('reminded people');
})
cron.schedule('0 17 * * 3' , ()=>{
  mail.sendReminderMail()
  console.log('reminded people');
})

app.use(cors())
app.use(exp.urlencoded({extended:true}));
app.use(exp.static('resources'));
app.use(exp.json())

app.get('/', (req,res)=>{
  res.sendFile('index.html', {root:'./views/'})
})

app.get('/reminder', (req,res)=>{
  mail.sendReminderMail()
  res.send("reminded people")
})
app.get('/confirm/test', async (req,res)=>{ // REMOVE WHEN DONE
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
  let date = new Date
  let thisWeek = date.getWeek()
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