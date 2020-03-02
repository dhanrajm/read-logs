/* include deafult/installed modules */

/* include custom modules */
const storage = require('../storage')
const utility = require('../utility')

/* get logger object */
const logger = utility.logger

/**
 * Method to validate the request params
 * @param  {URLSearchParams} searchParams passed search params
 * @return {boolean}              result of validate
 */
function validate (searchParams) {
  if (searchParams.has('year') === false) {
    logger.debug('app.controller.getLogs.validate: no year')
    return false
  }
  const year = searchParams.get('year')
  if (year.length !== 4) {
    logger.debug(`app.controller.getLogs.validate: invalid year ${year}`)
    return false
  }
  return true
}

/**
 * Extracts the params from the query string.
 * Calls the storage module to retrive the logs.
 * @param  {[string]} queryStr query string of the url
 * @return {[object]}          with status, message and data
 */
module.exports = async function (searchParams) {
  logger.debug(`app.controller.getLogs: start searchParams=${searchParams}`)

  /* validate the search params */
  if (validate(searchParams) === false) {
    logger.debug(
      `app.controller.getLogs: validation failed searchParams=${searchParams}`
    )
    return { status: 422, message: 'Invalid request params', data: {} }
  }

  const params = {}

  /* first extract the values to params object */
  for (const [name, value] of searchParams) {
    params[name] = value
  }

  /* call the storage modules to retrive logs */
  const data = await storage.read(params)

  /* forrm the response with all ok message */
  const status = 200
  const message = 'all ok'
  logger.debug(`app.controller.getLogs: end searchParams=${searchParams}`)
  return { status, message, data }
}
