// This module abstracts the logging.
// Right now, we are just using the console to log.
// This can be changed to transports

/**
 * Method to log debug messages
 * @param  {[string]} msg message to be logged
 */
exports.debug = function (msg) {
  console.debug(msg)
}

/**
 * Method to log info messages
 * @param  {[string]} msg message to be logged
 */
exports.info = function (msg) {
  console.info(msg)
}

/**
 * Method to log error messages
 * @param  {[string]} msg message to be logged
 */
exports.error = function (msg) {
  console.error(msg)
}
