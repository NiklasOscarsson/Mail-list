const {client} = require('./postgres')
const {setup} = require('./setup')
const {getAllInfo, getUser, getAllStudents} = require('./querys')
const {saveEval, updateEval, activateEvaluations} = require('./post')

module.exports = {
    client, 
    setup, 
    getAllInfo, 
    getUser, 
    saveEval, 
    getAllStudents,
    updateEval,
    activateEvaluations
}