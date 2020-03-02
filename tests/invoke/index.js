/* include deafult/installed modules */
const http = require('http')

module.exports = {
  http: {
    get: options => {
      return new Promise(function (resolve, reject) {
        http.get(options, res => {
          res.setEncoding('utf8')
          let response = null
          res.on('data', chunk => {
            if (response) {
              response = Buffer.concat(response, chunk)
            } else {
              response = chunk
            }
          })
          res.on('end', () => {
            response = JSON.parse(response)
            resolve(response)
          })
        })
      })
    }
  }
}
