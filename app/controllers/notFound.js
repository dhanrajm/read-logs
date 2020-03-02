/**
 * returns object with not found status and message
 * @return {[object]} with keys status, message and data
 */
module.exports = function () {
  return {
    status: 400,
    message: 'resource not found on the server',
    data: {}
  }
}
