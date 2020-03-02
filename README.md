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

Response:
```
{
    "status": <Status of the operation>,
    "message": <Success/error message>,
    "data": <Data returned as aresult of the operation>
}
```
Sample Request

> curl --location --request GET http://localhost:5000/api/v1/logs?year=2020&month=0&day=1&hour=00&minute=19&second=06&milliSecond=342&skip=0&limit=100

Sample Success Response
```json
{
    "status": 200,
    "message": "all ok",
    "data": [
        "2020-01-01T00:19:06.342Z Querying table posts",
        "2020-01-01T00:19:13.822Z Finished reading posts",
        "2020-01-01T00:19:22.108Z Response 200 sent to 42.152.167.121 for /home",
    ]
}
```

Sample Error Response
```json
{
    "status": 400,
    "message": "resource not found on the server",
    "data": {}
}
```
## Tests
 
 Tests are given in the folder ./tests
 
 Execute: 
 
 > node ./test/index.js 
