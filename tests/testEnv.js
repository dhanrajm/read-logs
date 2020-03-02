const config = {
  RL_NODE_ENV: 'test',
  RL_HOST: '127.0.0.1',
  RL_PORT: '5000',
  RL_APP_ID: 'read-logs',
  RL_APPLOG_DIR: '../logs',
  RL_METADATA_DIR: './tests/metadata',
  RL_LOG_FILE_PATH: './tests/data/test.txt',
  RL_RESP_LINES_LIMIT: 100
}

/* deep copy the config to process.env obejct */
process.env = Object.assign(process.env, config)
