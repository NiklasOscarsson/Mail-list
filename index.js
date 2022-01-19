const exp = require('express');
const cors = require('cors')
const cookie = require('cookie-parser')
const Mail = require('./resources/js/server/mail');
const {client, setup, getInfo, saveEval} = require('./resources/js/server/postgres')
const {verifyToken, loginAuth, updateCookie, verifyUser} = require('./resources/js/server/serverFunctions')
require('dotenv').config();
require('./resources/js/server/week')
const app = exp();

const mailer = []
mailer.push(new Mail())

app.use(cookie())
app.use(cors())
app.use(exp.urlencoded({extended:true}));
app.use(exp.static('resources'));
app.use(exp.json())

setup()


//GET

app.get('/test', (req, res)=>{
  res.sendFile('profile.html', {root:'./views/'})
})


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
app.get('/profile', verifyToken, updateCookie, (req,res)=>{
  res.sendFile('profile.html',{root:'./views/'})
})
app.get('/profile/login', (req,res)=>{
  res.sendFile('login.html',{root:'./views/'})
})
app.get('/profile/setup/db', verifyToken,async (req,res)=>{
  console.log('in');
  const check = await setup(res)
  console.log(check);
  if(check){
    console.log('in 2');
    res.send('Setup completed')
  }
})
app.get('/profile/webmin', verifyToken, (req,res,next)=>{
  res.redirect('https://nti-karlstad.duckdns.org:10000/')
})


//POST
app.post('/setSubject', verifyToken, async (req,res)=>{
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

app.post('/getInfo', verifyToken, getInfo)

app.post('/profile/login', loginAuth)

app.post('/userInfo', verifyToken, verifyUser)

app.post('/evaluate', verifyToken, saveEval)


app.listen(process.env.SERVERPORT || 3000, (error)=>{
  if(error){
    console.log(error);
  }else{
    console.log('Connected');
  }
})