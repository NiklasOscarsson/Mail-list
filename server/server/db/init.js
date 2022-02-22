const {client} = require('./postgres')
const {setup} = require('./setup')
const {getUserInfo, getUser} = require('./querys')
const {saveEval} = require('./post')

module.exports = {client, setup, getUserInfo, getUser, saveEval}