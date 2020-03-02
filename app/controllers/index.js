/* include deafult/installed modules */
const url = require('url')

/* include custom modules */
const getHealth = require('./getHealth')
const notFound = require('./notFound')
const getLogs = require('./getLogs')
const utility = require('../utility')

/* get logger object */
const logger = utility.logger

/**
 * Controller entry point.
 * This method routes the incomming request to respective handlers
 * @param  {[object]} req internal IncomingMessage object
 * @return {[object]}     object with keys status, message and data
 */
module.exports = function (req) {
  logger.debug(`recieved ${req.method}: ${req.url}`)

  /* use the builtin url library to parse request url */
  const parsedUrl = new url.URL(req.url, `http://${req.headers.host}`)

  /* check the incomming method and path to route requests */
  if (req.method === 'GET' && parsedUrl.pathname === '/_health') {
    /* health check route to get status of api server */
    logger.debug('/_health check ok')
    return getHealth()
  } else if (req.method === 'GET' && parsedUrl.pathname === '/api/v1/_health') {
    /* health check route to get status of version 1 routes */
    logger.debug('/api/v1/_health check ok')
    return getHealth()
  } else if (req.method === 'GET' && parsedUrl.pathname === '/api/v1/logs') {
    /* route to get the logs */
    return getLogs(parsedUrl.searchParams)
  } else {
    /* handle the case when the incomming route is not implemented */
    logger.debug(`invalid route recieved ${req.method}: ${req.url}`)
    return notFound()
  }
}
