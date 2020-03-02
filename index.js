/* load the envs to process.env */
require('./env')

try {
  console.log('**************** STARTING SERVER ****************')
  /* start the application */
  require('./app')
} catch (e) {
  console.error(
    '**************** --> ERROR IN STARTING SERVER <-- ****************'
  )
  console.error(e)
}
