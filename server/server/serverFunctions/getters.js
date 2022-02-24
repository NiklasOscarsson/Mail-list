const { getAllInfo } = require('../db/init')
const { sorter } = require('./other')

async function getAll(req, res, next) {
    let info = await getAllInfo()
    info = sorter(info)
    console.log('sent info');
    res.send(info)
}


module.exports = {
    getAll
}