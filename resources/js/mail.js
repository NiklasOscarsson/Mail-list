const sgMail=require('@sendgrid/mail');
const client = require('./postgres')
const {reminder} = require('./reminder')
require('./week')

date=new Date
let week = date.getWeek()

class Mail {
  constructor(){
    this.to = 'Niklas.Oscarsson@ga.ntig.se';
    this.from = 'Niklas.Oscarsson@ntig.se';
    this.subject = 'Veckoraport';
    this.text = 'Något här också';
    this.html = '';
    this.confirmation = 'http://10.130.248.43:3000/confirm'
    this.confirmationAdress = 'Niklas.Oscarsson@ga.ntig.se'
    
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
  async sendReminderMail(){
    sgMail.send({
      to:this.to,
      from:this.from,
      subject:this.subject,
      text:this.text,
      html:reminder
    })
    .then(()=>{console.log(`email sent to ${this.from}`);})
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
    .then(()=>{console.log(`email sent to ${this.from}`);})
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
    .then(()=>{console.log(`email sent to ${this.from}`);})
    .catch((err)=>{console.log(err);})
  }
  sortHtml(result){
    let design = result.filter(e=> e.subject.trim() === "Design")
    let Digitalt_skapande = result.filter(e=> e.subject.trim() === "Digitalt skapande")
    let Engelska = result.filter(e=> e.subject.trim() === "Engelska")
    let Gränssnittsdesign = result.filter(e=> e.subject.trim() === "Gränssnittsdesign")
    let Historia = result.filter(e=> e.subject.trim() === "Historia")
    let Idrott = result.filter(e=> e.subject.trim() === "Idrott")
    let Religion = result.filter(e=> e.subject.trim() === "Religion")
    let Svenska = result.filter(e=> e.subject.trim() === "Svenska")
    let Webbutveckling = result.filter(e=> e.subject.trim() === "Webbutveckling")
    let newResult = []
    design.forEach(e => {newResult.push(e)});
    Digitalt_skapande.forEach(e => {newResult.push(e)});
    Engelska.forEach(e => {newResult.push(e)});
    Gränssnittsdesign.forEach(e => {newResult.push(e)});
    Historia.forEach(e => {newResult.push(e)});
    Idrott.forEach(e => {newResult.push(e)});
    Religion.forEach(e => {newResult.push(e)});
    Svenska.forEach(e => {newResult.push(e)});
    Webbutveckling.forEach(e => {newResult.push(e)});
    return newResult
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