/**
 * return a success object
 * @return {[object]} object with keys status, message and data
 */
module.exports = function () {
  return {
    status: 200,
    message: 'ok',
    data: {}
  }
}
