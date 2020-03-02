# read-logs

## Instruction to run:

### Step 1: Create an env.js file at root with following structure

```javascript
const config = {
  RL_NODE_ENV: 'production',
  RL_HOST: '127.0.0.1',
  RL_PORT: '5000',
  RL_APP_ID: 'read-logs',
  RL_APPLOG_DIR: '../logs',
  RL_METADATA_DIR: '../data/metadata',
  RL_LOG_FILE_PATH: '../data/example.txt',
  RL_RESP_LINES_LIMIT: 100
}

/* deep copy the config to process.env obejct */
process.env = Object.assign(process.env, config)
```

### Step 2: Generate the metadata from log file

> node scripts/index.js

PS: Ensure that the log file is kept in the path given in env value RL_LOG_FILE_PATH

### Step 3: Run the below command from application root directory to start the nodejs web server

> node index.js

Application should be running at the configured port

## Instructions for API call:

> GET /api/v1/logs

Search Params:

- year:<Mandatory | Start year of logs | Ex: 2020>
- month:<Optional | Start month of logs | Values [0,1,2...10,11] for Jan, Feb, Mar....Nov, Dec | Ex: 0>
- day:<Optional | Start day of logs | Values 1-31 | Ex: 1>
- hour:<Optional | Start hour of logs | Values 0-24 | Ex: 11>
- minute:<Optional | Start minute of logs | Values 0-60 | Ex: 19>
- second:<Optional | Start second of logs | Values 0-60 | Ex: 06>
- milliSecond:<Optional | Start millisecond of logs | Values 0-999 | Ex: 342>

Below two params are for pagination

- skip: <Optional | Lines to be skippep>
- limit: <Optional | Total lines to be returned. Response will have min(limit, RL_RESP_LINES_LIMIT) >

Sample Request

> curl --location --request GET http://localhost:5000/api/v1/logs?year=2020&month=0&day=1&hour=00&minute=19&second=06&milliSecond=342&skip=0&limit=100

## Tests
 
 Tests are given in the folder ./tests
 
 Execute: 
 
 > node ./test/index.js 
