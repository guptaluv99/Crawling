let mongoose = require('mongoose');
const server = '52.66.146.189:27017';
const uname = 'lovish';
const password = 'exambazaar_lovish_2018'
const database = 'exambazaar';
const authenticServer = uname + ':' + password + '@' + server;
class Database {
  constructor() {
    this._connect()
  }
_connect() {
    
        mongoose.connect(`mongodb://localhost:27017/Practice`)
        .then(() => {
            console.log('Database localhost connection successful')
        })
        .catch(err => {
            console.error('Database localhost connection error')
       })
  }
}
module.exports = new Database()