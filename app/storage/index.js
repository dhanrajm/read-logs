/* load config first */
const config = require('../config')

/* include deafult/installed modules */
const fs = require('fs')
const { createInterface } = require('readline')

/* include custom modules */
const utility = require('../utility')

/* get logger object */
const logger = utility.logger

/**
 *  Returns the keys of the object(with numneric keys) in ascending order
 * @param  {object} list object with numneric keys
 * @return {array}      sorted keys array in ascending order
 */
function getSortedKeys (list) {
  return Object.keys(list).sort((a, b) => {
    return Number(list[a]) - Number(list[b])
  })
}

/**
 * Get offset value from the passed data object
 * Offset value is returned for the passed month, day, hour
 * if month or day or hour is not in data, the first value is taken
 * @param {string} data  object with offset values for all month,day and hour
 * @param {string} month string denoting the month
 * @param {string} day   string denoting the day
 * @param {string} hour  string denoting the hour
 * @return {Number}      offset value
 */
function getOffset (data, month, day, hour) {
  /* check if passed month exits in data object */
  if (typeof data[month] === 'undefined') {
    /* passed month is not present, so take the first month present in data object */
    /* to get the first month, get list of months in sorted order */
    const sortedMonths = getSortedKeys(data)
    /* first month is the first value in the sorted list */
    month = sortedMonths[0]
  }

  /* check if passed day exits in data object */
  if (typeof data[month][day] === 'undefined') {
    /* passed day is not present, so take the first day present in data object */
    /* to get the first day, get list of days in sorted order */
    const sortedDays = getSortedKeys(data[month])
    /* first day is the first value in the sorted list */
    day = sortedDays[0]
  }

  /* check if passed hour exits in data object */
  if (typeof data[month][day][hour] === 'undefined') {
    /* passed hour is not present, so take the first hour present in data object */
    /* to get the first hour, get list of hours in sorted order */
    const sortedHours = getSortedKeys(data[month][day])
    /* first hour is the first value in the sorted list */
    hour = sortedHours[0]
  }

  logger.debug(`storage.getOffset: for ${month} ${day} ${hour}`)
  /* return the offset value */
  return data[month][day][hour].offset
}

/**
 * Reads the lines from the log file
 * @param  {object} params Passed arguments. deafult value for month is 0, day is 1 and hour 0
 * @return {Promise}        Promise which resolves to list of log lines.
 */
exports.read = function (params) {
  /* extract values */
  const year = params.year
  /* default value for month is 0 */
  const month = params.month || '0'
  /* default value for day is 1 */
  const day = params.day || '1'
  /* default value for hour is 0 */
  const hour = params.hour || '0'
  /* take the limit from passed param or from config. If either of them not present, default to 100 */
  const limit = params.limit || config.storage.limit || 100
  /* default value for skip is 0 */
  const skip = params.skip || 0

  logger.debug(
    `storage.read: for year=${year} month=${month} day=${day} hour=${hour} skip=${skip} limit=${limit}`
  )

  let filterByDate = false
  const dt = new Date()
  dt.setUTCFullYear(parseInt(year))
  dt.setUTCMonth(parseInt(month))
  dt.setUTCDate(parseInt(day))
  dt.setUTCHours(parseInt(hour))
  dt.setUTCMinutes(0)
  dt.setUTCSeconds(0)
  dt.setUTCMilliseconds(0)

  if (params.minute) {
    dt.setUTCMinutes(parseInt(params.minute))
    filterByDate = true
  }
  if (params.second) {
    dt.setUTCSeconds(parseInt(params.second))
    filterByDate = true
  }
  if (params.milliSecond) {
    dt.setUTCMilliseconds(parseInt(params.milliSecond))
    filterByDate = true
  }

  logger.debug(
    `storage.read: for ${dt.toISOString()} skip=${skip} limit=${limit}`
  )

  /* return a promise */
  return new Promise((resolve, reject) => {
    /* check if metadata dir exits */
    if (fs.existsSync(config.metadata.dir) === false) {
      /* reject the promise with error that metadata is not present */
      reject(Error('storage.read: metadata folder is not generated'))
    }

    /* check if the metadata file for the year exists */
    if (fs.existsSync(`${config.metadata.dir}/${year}.json`) === false) {
      /* log that year metadata is not present and return empty */
      logger.debug(`storage.read: metadata for ${year} not found`)
      resolve([])
    }

    /* read the metadata for the given year */
    let data = fs.readFileSync(`${config.metadata.dir}/${year}.json`).toString()
    data = JSON.parse(data)

    /* get the offset to seek to(in log file) for the passed month day hour combination */
    const offset = getOffset(data, String(month), String(day), String(hour))
    if (offset === null || typeof offset === 'undefined') {
      reject(
        Error(`storage.read: invalid offset ${year} ${month} ${day} ${hour}`)
      )
    }

    /* create a read stream to log file with starting position at offset */
    const readableStream = fs.createReadStream(config.storage.filePath, {
      start: offset
    })

    /* use the nodeja readline module to stream each line from the read stream */
    const rl = createInterface({
      input: readableStream,
      crlfDelay: Infinity
    })

    const lines = [] // array to keep the lines to be returned
    let lineCounter = 0 // keep track of number of lines read

    /* event handler for 'line' event */
    rl.on('line', line => {
      if (filterByDate === true) {
        const dtStr = line.split(' ')[0]
        const lineDate = new Date(dtStr)
        if (lineDate < dt) {
          return
        }
      }

      lineCounter++ // increment the line counter on each line read
      /* check if lines limit reached */
      if (lines.length === parseInt(limit)) {
        /* limit reached, log and close the stream */
        // logger.debug(`storage.read: closing ${lines.length}=${limit}`)
        rl.close()
        return
      }
      /* check if the line can be added to the return list */
      if (lineCounter > parseInt(skip)) {
        lines.push(line) // add the line to list
      }
    })

    /* event handler for 'close' event */
    rl.on('close', () => {
      /* realine is closed, hence destroy the read stream opened earlier */
      readableStream.destroy()
      logger.debug(`storage.read: returning ${lines.length} lines`)
      resolve(lines) // resolve the promise with lines list
    })

    /* event handler for 'error' event */
    rl.on('error', e => {
      logger.debug('storage.read: realine stream error')
      reject(e) // error happened, hence reject promise
    })
  })
}
