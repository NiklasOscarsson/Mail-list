const reminder = `
<body>
  <style>
    #banner{
      height:100px; 
      text-align:center;
    }
  </style>
  <h1>Hej allesammans</h1>
  <br>
  <p>En vänlig påminnelse om att skriva in hur det går för Lucas H i ES20</p>
  <p>för att enkelt skicka in detta kan ni följa <a href="http://nti-karlstad.duckdns.org/"><b>denna länk</b></a></p>
  <br>
  <p>Informationen går iväg till VH onsdag kl.17:00 
  <br>
  <hr>
  <p>Mvh</p>
  <p>Niklas Oscarsson</p>
  <p>Mentor/Lärare</p> 
  <br>
  <div id="banner";>
    <img src='https://www.ri.se/sites/default/files/styles/full_width/public/2020/11/nti.png' style="height: 100px;">
  </div>
</body>

`

const mail_list = [
  // 'asa.granberg@ntig.se', 
  'Niklas.Oscarsson@ga.ntig.se', 
  'robert.jonsson@ga.ntig.se', 
  /* 'robin.brack@ga.ntig.se', 
  'Andreas.Fritiofsson@ntig.se', 
  'andreas.karlsson@ga.ntig.se',
  'hanna.horling@ntig.se' */

]

module.exports = {reminder, mail_list}