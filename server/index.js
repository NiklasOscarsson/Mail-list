const exp = require('express');
const cors = require('cors')
const cookie = require('cookie-parser')
const Mail = require('./server/mailer/mail');
const {client, setup, saveEval, updateEval, activateEvaluations} = require('./server/db/init')
const {verifyToken, loginAuth, updateCookie, verifyUser, getAll} = require('./server/serverFunctions/init')
const cron = require('node-cron')
const request = require('request')

require('dotenv').config();
require('./server/serverFunctions/week')
const app = exp();

const mailer = []
mailer.push(new Mail())

app.use(cookie())
app.use(cors())
app.use(exp.urlencoded({extended:true}));
app.use(exp.static('resources'));
app.use(exp.json())


//setup()
/* cron.schedule('0 2 * * 1', ()=>{
  request('https://api.myip.com', (err, res, body)=>{
    const myIP = JSON.parse(body);
    request(`https://www.duckdns.org/update/nti-karlstad/3a13e492-6b0f-4e16-b6ff-5b3e05552c67/${myIP.ip}`, (err, res, body)=>{
      console.log(body);
    })
  })
}) */

//GET

app.get('/test', (req, res)=>{
  res.sendFile('profile.html', {root:'./views/'})
})


app.get('/', (req,res)=>{
  res.sendFile('index.html', {root:'./views/'})
})
/* app.get('/reminder', (req,res)=>{
  mailer[0].sendReminderMail()
  res.send("reminded people")
}) */
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

app.post('/getInfo', /* verifyToken ,*/ getAll)

//app.post('/profile/login', loginAuth)

//app.post('/userInfo', verifyToken, verifyUser)
app.post('/activateEvaluations', /* verifyToken, */ activateEvaluations)
app.post('/evaluate', /* verifyToken, */ saveEval)
app.post('/updateEvaluation', /* verifyToken, */ updateEval)


app.listen(process.env.SERVERPORT || 3000, (error)=>{
  if(error){
    console.log(error);
  }else{
    console.log('Connected');
  }
})