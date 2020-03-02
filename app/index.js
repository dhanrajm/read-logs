/* load config first */
const config = require('./config')

/* include deafult/installed modules */
const http = require('http')

/* include custom modules */
const utility = require('./utility')
const ack = require('./ack')
const controllers = require('./controllers')

/* get logger object */
const logger = utility.logger

/* add handler to handle unhandledRejection */
process.on('unhandledRejection', function (e) {
  logger.error('**************** --> unhandledRejection <-- ****************')
  logger.error(e)
})

/* add handler to handle uncaughtException */
process.on('uncaughtException', (err, origin) => {
  logger.error('**************** --> uncaughtException <-- ****************')
  logger.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`)
})

/**
 * Handler for incomming http requests
 * @param  {[object]}  req IncomingMessage object
 * @param  {[object]}  res internal ServerResponse object
 * @return {Promise}     resolves to response value
 */
const requestHandler = async (req, res) => {
  let status, message, data
  try {
    const retData = await controllers(req)
    status = retData.status
    message = retData.message
    data = retData.data
  } catch (e) {
    logger.error('unexpected error happend')
    logger.error(e)
    status = 500
    message = 'unexpected error happend'
    data = {}
  } finally {
    ack.sendResponse(res, status, message, data)
  }
}

/* get the host and port from config */
const { host, port } = config.api

/* create http server */
const server = http.createServer(requestHandler)

server.listen({ host, port }, e => {
  if (e) {
    logger.error('server start error')
    logger.error(e)
    process.exit(1)
  }

  logger.info(`server is listening on ${port}`)
})
