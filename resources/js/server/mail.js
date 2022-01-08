const sgMail=require('@sendgrid/mail');
const {client} = require('./postgres')
const {reminder, mail_list} = require('./reminder')
const {sortHtmlTags} = require('./mailsorter')
const cron = require('node-cron')
require('./week')

date=new Date
let week = date.getWeek()

class Mail {
  constructor(){
    this.to = 'Niklas.Oscarsson@ga.ntig.se';
    this.reminder = mail_list
    this.from = 'Niklas.Oscarsson@ntig.se';
    this.subject = 'Veckoraport';
    this.text = 'Något här också';
    this.html = '';
    this.confirmation = 'http://nti-karlstad.duckdns.org/confirm/0'
    this.confirmationAdress = 'asa.granberg@ntig.se'
    this.testAdress = 'Niklas.Oscarsson@ga.ntig.se'
    
    sgMail.setApiKey(process.env.SGMAILKEY);
    client.connect()
  }
  setRecipiant(recipiant){
    this.from = recipiant
  }
  setReciver(reciver){
    this.to = reciver
  }
  async getSubjects(){
    week = date.getWeek()
    return await client.query('SELECT subject, report FROM reports WHERE week = $1', [week])
    .then(async (r) => {
      let result = r.rows
      return result
    })
  }
  schedualMails(){
    cron.schedule('0 8 * * 1' , ()=>{
      this.sendReminderMail()
    })
    cron.schedule('0 17 * * 5' , async ()=>{
      await this.updateMailTemplate()
      this.sendConfimationMail()
      res.send('mail sent to '+ this.confirmationAdress)
    }) 
  }
  async sendReminderMail(){
    sgMail.send({
      to:this.reminder,
      from:this.from,
      subject:this.subject,
      text:this.text,
      html: reminder
    })
    .then(()=>{console.log(`email sent to ${this.reminder}`);})
    .catch((err)=>{console.log(err);})
  }
  async sendConfimationMailTest(){  //REMOVE WHEN DONE
    sgMail.send({
      to:this.testAdress,
      from:this.from,
      subject:this.subject,
      text:this.text,
      html:`<h2>Om allt ser bra ut klicka <a href="${this.confirmation}">här</a></h2>\n ${this.html}`
    })
    .then(()=>{console.log(`email sent to ${this.testAdress}`);})
    .catch((err)=>{console.log(err);})
  }
  async sendConfimationMail(){
    sgMail.send({
      to:this.confirmationAdress,
      from:this.from,
      subject:this.subject,
      text:this.text,
      html:`<h2>Om allt ser bra ut klicka <a href="${this.confirmation}">här</a></h2>\n ${this.html}`
    })
    .then(()=>{console.log(`email sent to ${this.confirmationAdress}`);})
    .catch((err)=>{console.log(err);})
  }

  async sendMail(){
    sgMail.send({
      to:this.to,
      from:this.from,
      subject:this.subject,
      text:this.text,
      html:this.html
    })
    .then(()=>{console.log(`email sent to ${this.to}`);})
    .catch((err)=>{console.log(err);})
  }
  sortHtml(result){
    return sortHtmlTags(result)
  }

  async updateMailTemplate(){
    let subjects = await this.getSubjects()
    let snippet = this.setSnippet(this.sortHtml(subjects)) //sorts the list of subjects and makes a snippet to use for the final html
    this.html = this.setHtml(snippet)
  }

  setSnippet(e){
    let snippet = ''
    let arr = []
    //Setting subjects and info into HTML
    for(let i = 0; i < e.length; i++){
      if(!arr.includes(e[i].subject)){
        if(snippet !== ''){
          snippet += `</ul>\n
          </div>\n` 
        }
        e[i].report.trim()
        let split = e[i].report.split('.\n')
        split = e[i].report.split('.\r\n')
        snippet += `
        <div id="subject">\n
          <h2>${e[i].subject.trim()}</h2>\n
          <ul>`
        for(let s in split){
        snippet += `
          <li>${split[s].trim()}.</li>\n`
        }
          arr.push(e[i].subject)
      }else{
        snippet += `<li>${e[i].report}</li>\n`
      }
    }
    return snippet
  }

  setHtml(snippet){
    
    let html = `
      <style>
        #banner{
            height:100px; 
            text-align:center;
        }
        #subject{
          border-radius: solid 2px black;
        }
      </style>
      ${snippet}
      <br>
      <hr>
      <p>Mvh</p>
      <p>Niklas Oscarsson</p>
      <p>Mentor/Lärare</p> 
      <br>
      <div id="banner";>
        <img src='https://www.ri.se/sites/default/files/styles/full_width/public/2020/11/nti.png' style="height: 100px;">
      </div>
    `
    return html
  }
  
}

module.exports = Mail