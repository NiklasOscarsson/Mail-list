const exp = require('express');
const Mail = require('./resources/js/mail');
const {client, setup} = require('./resources/js/postgres')
require('./resources/js/week')
require('dotenv').config();
const cors = require('cors')
const cron = require('node-cron')
const app = exp();
const mailer = []
mailer.push(new Mail())

cron.schedule('0 8 * * 1' , ()=>{
  mailer[0].sendReminderMail()
  console.log('reminded people');
})
cron.schedule('0 17 * * 5' , async ()=>{
  await mailer[0].updateMailTemplate()
  mailer[0].sendConfimationMail()
  res.send('mail sent to '+ mailer[0].confirmationAdress)
})

app.use(cors())
app.use(exp.urlencoded({extended:true}));
app.use(exp.static('resources'));
app.use(exp.json())

function auth(req,res,next){

    next()
}


//GET
app.get('/', (req,res)=>{
  res.sendFile('index.html', {root:'./views/'})
})
app.get('/reminder', (req,res)=>{
  mailer[0].sendReminderMail()
  res.send("reminded people")
})
app.get('/confirmation', async (req,res)=>{
  await mailer[0].updateMailTemplate()
  mailer[0].sendConfimationMailTest()
  res.send('mail sent to '+ mailer[0].to)
})
app.get('/confirmed/:person', async (req,res)=>{
  await mailer[0].updateMailTemplate()
  mailer[0].sendConfimationMail()
  res.send('mail sent to '+ mailer[0][req.params.person])
})
app.get('/admin/setup/db', auth(), (req,res)=>{
  setup(res)
})
app.get('/admin', auth(), (req,res)=>{
  res.redirect('https://localhost:10000')
})


//POST
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