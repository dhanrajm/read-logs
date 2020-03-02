/**
 * Sends a custom standard response.
 * All responses have status code 200.
 * Let frontend app decode action status from the returned status.
 * @param  {[object]} res     internal ServerResponse object
 * @param  {[string]} status  status to be send to frontend application
 * @param  {[string]} message message to be send to frontend application
 * @param  {[object]} data    data to be send to frontend application
 */
module.exports.sendResponse = function (res, status, message, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.write(JSON.stringify({ status, message, data }))
  res.end()
}
