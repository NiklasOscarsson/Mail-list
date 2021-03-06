const exp = require('express');
const cors = require('cors')
const cookie = require('cookie-parser')
const Mail = require('./resources/js/mail');
const {client, setup} = require('./resources/js/postgres')
const {verifyToken, loginAuth} = require('./resources/js/serverFunctions')
require('dotenv').config();
require('./resources/js/week')
const app = exp();

const mailer = []
mailer.push(new Mail())

app.use(cookie())
app.use(cors())
app.use(exp.urlencoded({extended:true}));
app.use(exp.static('resources'));
app.use(exp.json())


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
app.get('/admin', verifyToken, (req,res)=>{
  res.sendFile('admin.html',{root:'./views/'})
})
app.get('/admin/login', (req,res)=>{
  res.sendFile('login.html',{root:'./views/'})
})
app.get('/admin/setup/db', verifyToken,(req,res)=>{
  setup(res)
})
app.get('/admin/webmin', verifyToken, (req,res,next)=>{
  res.redirect('https://nti-karlstad.duckdns.org:10000/')
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
app.post('/admin/login', loginAuth, (req,res)=>{})


app.listen(process.env.SERVERPORT || 3000, (error)=>{
  if(error){
    console.log(error);
  }else{
    console.log('Connected');
  }
})