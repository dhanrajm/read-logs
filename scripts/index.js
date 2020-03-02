/* load the envs to process.env */
require('../env')

/* load config first */
const config = require('../app/config')

const fs = require('fs')

let sstable = {}
const count = 0
let currentYear = 0

/* ensure directory exists */
fs.existsSync(config.metadata.dir) || fs.mkdirSync(config.metadata.dir)

/* create a read stream to the log file */
const rs = fs.createReadStream(config.storage.filePath)

/**
 * Method to search for line endng patter in the read buffer
 * @param  {Buffer} buffer Buffer read
 * @return {array}        List of lines
 */
function searchInBuffer (buffer) {
  let prevIndex = 0
  const lines = []
  var i = 0
  while (i < buffer.length) {
    if (buffer[i] === 10) {
      lines.push(buffer.slice(prevIndex, i + 1))
      prevIndex = i + 1
    } else if (buffer[i] === 13) {
      if (buffer[i + 1] === 10) {
        i++
      }
      lines.push(buffer.slice(prevIndex, i + 1))
      prevIndex = i + 1
    }
    i++
  }
  lines.push(buffer.slice(prevIndex, i + 1))
  return lines
}

/**
 * Method to build and persist the sstable info
 * @param  {string} line line from the read buffer
 */
function dumpToSSTable (line) {
  const dateStr = line.split(' ')[0]
  const dt = new Date(dateStr)

  const year = dt.getUTCFullYear()
  if (typeof sstable[year] === 'undefined') {
    if (currentYear) {
      fs.writeFileSync(
        `${config.metadata.dir}/${currentYear}.json`,
        JSON.stringify(sstable[currentYear], null, '\t')
      )
      sstable = {}
    }
    currentYear = year
    sstable[year] = {}
  }

  const month = dt.getUTCMonth()
  if (typeof sstable[year][month] === 'undefined') {
    sstable[year][month] = {}
  }

  const day = dt.getUTCDate()
  if (typeof sstable[year][month][day] === 'undefined') {
    sstable[year][month][day] = {}
  }

  const hour = dt.getUTCHours()
  if (typeof sstable[year][month][day][hour] === 'undefined') {
    sstable[year][month][day][hour] = {}
  }

  if (typeof sstable[year][month][day][hour].offset === 'undefined') {
    sstable[year][month][day][hour].offset = totalBytes
    sstable[year][month][day][hour].count = 1
  } else {
    sstable[year][month][day][hour].count++
  }
}

let totalBytes = 0
let previousLine = null
rs.on('data', chunk => {
  const lines = searchInBuffer(chunk)
  for (let line of lines) {
    line = Buffer.from(line)
    if (previousLine === null) {
      if (line[line.length - 1] === 10 || line[line.length - 1] === 13) {
        dumpToSSTable(line.toString())
        totalBytes += line.length
      } else {
        previousLine = line
      }
    } else {
      line = Buffer.concat([previousLine, line])
      if (line[line.length - 1] === 10 || line[line.length - 1] === 13) {
        dumpToSSTable(line.toString())
        totalBytes += line.length
        previousLine = null
      } else {
        previousLine = line
      }
    }
  }
})

rs.on('close', () => {
  if (currentYear && sstable[currentYear]) {
    fs.writeFileSync(
      `${config.metadata.dir}/${currentYear}.json`,
      JSON.stringify(sstable[currentYear], null, '\t')
    )
  }
})
