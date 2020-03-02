/* include deafult/installed modules */

/* include custom modules */
const storage = require('../storage')
const utility = require('../utility')

/* get logger object */
const logger = utility.logger

/**
 * Method to validate the request params
 * @param  {URLSearchParams} searchParams passed search params
 * @return {boolean}              result of validation
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

  /* if month is passed, then the value should be in [0,1,2...10,11] for Jan, Feb, Mar....Nov, Dec */
  if (searchParams.has('month') === true) {
    let month = searchParams.get('month')
    if (!month) {
      logger.debug('app.controller.getLogs.validate: empty month')
      return false
    }
    month = parseInt(month)
    if (month < 0 || month > 11) {
      logger.debug(`app.controller.getLogs.validate: invalid month ${month}`)
      return false
    }
  }

  /* if day is passed, then value should be 1-31 */
  if (searchParams.has('day') === true) {
    let day = searchParams.get('day')
    if (!day) {
      logger.debug('app.controller.getLogs.validate: empty day')
      return false
    }
    day = parseInt(day)
    if (day < 1 || day > 31) {
      logger.debug(`app.controller.getLogs.validate: invalid day ${day}`)
      return false
    }
  }

  /* if hour is passed, then value should be 0-24 */
  if (searchParams.has('hour') === true) {
    let hour = searchParams.get('hour')
    if (!hour) {
      logger.debug('app.controller.getLogs.validate: empty hour')
      return false
    }
    hour = parseInt(hour)
    if (hour < 0 || hour > 24) {
      logger.debug(`app.controller.getLogs.validate: invalid hour ${hour}`)
      return false
    }
  }

  /* if minute is passed, then value should be 0-60 */
  if (searchParams.has('minute') === true) {
    let minute = searchParams.get('minute')
    if (!minute) {
      logger.debug('app.controller.getLogs.validate: empty minute')
      return false
    }
    minute = parseInt(minute)
    if (minute < 0 || minute > 60) {
      logger.debug(`app.controller.getLogs.validate: invalid minute ${minute}`)
      return false
    }
  }

  /* if second is passed, then value should be 0-60 */
  if (searchParams.has('second') === true) {
    let second = searchParams.get('second')
    if (!second) {
      logger.debug('app.controller.getLogs.validate: empty second')
      return false
    }
    second = parseInt(second)
    if (second < 0 || second > 60) {
      logger.debug(`app.controller.getLogs.validate: invalid second ${second}`)
      return false
    }
  }

  /* if milliSecond is passed, then value should be 0-999 */
  if (searchParams.has('milliSecond') === true) {
    let milliSecond = searchParams.get('milliSecond')
    if (!milliSecond) {
      logger.debug('app.controller.getLogs.validate: empty milliSecond')
      return false
    }
    milliSecond = parseInt(milliSecond)
    if (milliSecond < 0 || milliSecond > 999) {
      logger.debug(
        `app.controller.getLogs.validate: invalid milliSecond ${milliSecond}`
      )
      return false
    }
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
