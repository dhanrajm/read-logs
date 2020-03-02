module.exports = {
  api: {
    host: process.env.RL_HOST,
    port: process.env.RL_PORT
  },
  logger: {
    appId: process.env.RL_APP_ID,
    dir: process.env.RL_APPLOG_DIR
  },
  metadata: {
    dir: process.env.RL_METADATA_DIR
  },
  storage: {
    filePath: process.env.RL_LOG_FILE_PATH,
    limit: parseInt(process.env.RL_RESP_LINES_LIMIT)
  }
}
