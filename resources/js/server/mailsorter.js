function sortMail(results){

}

function sortHtmlTags(result){
  let design = result.filter(e=> e.subject.trim() === "Design")
  let Digitalt_skapande = result.filter(e=> e.subject.trim() === "Digitalt skapande")
  let Engelska = result.filter(e=> e.subject.trim() === "Engelska")
  let Gränssnittsdesign = result.filter(e=> e.subject.trim() === "Gränssnittsdesign")
  let Historia = result.filter(e=> e.subject.trim() === "Historia")
  let Idrott = result.filter(e=> e.subject.trim() === "Idrott")
  let Konstarterna_och_Samhället = result.filter(e=> e.subject.trim() === "Konstarterna_och_Samhället")
  let Medieproduktion = result.filter(e=> e.subject.trim() === "Medieproduktion")
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
  Konstarterna_och_Samhället.forEach(e => {newResult.push(e)});
  Medieproduktion.forEach(e => {newResult.push(e)});
  Religion.forEach(e => {newResult.push(e)});
  Svenska.forEach(e => {newResult.push(e)});
  Webbutveckling.forEach(e => {newResult.push(e)});
  return newResult
}

module.exports = {sortHtmlTags}