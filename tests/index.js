/* load the envs to process.env */
require('./testEnv')

/* start the application */
require('../app')

/* load modules for test */
const assert = require('assert')
const cases = require('./cases')

async function start () {
  try {
    let result

    console.log('testing the health of server')
    result = await cases.health()
    assert.notStrictEqual(typeof result, 'undefined', 'Health check failed')
    assert.notStrictEqual(result, null, 'Health check failed')
    assert.strictEqual(result.status, 200, 'Health check failed')
    console.log('tested the health of server')

    console.log('testing get logs params')
    result = await cases.getLogs('202', '0', '01', '00', '00', '11', '172')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs year param test failed'
    )
    assert.notStrictEqual(result, null, 'get logs year param test failed')
    assert.strictEqual(result.status, 422, 'get logs year param test failed')

    result = await cases.getLogs('2020', '12', '01', '00', '00', '11', '172')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs month param test failed'
    )
    assert.notStrictEqual(result, null, 'get logs month param test failed')
    assert.strictEqual(result.status, 422, 'get logs month param test failed')

    result = await cases.getLogs('2020', '11', '0', '00', '00', '11', '172')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs day param test failed'
    )
    assert.notStrictEqual(result, null, 'get logs day param test failed')
    assert.strictEqual(result.status, 422, 'get logs day param test failed')

    result = await cases.getLogs('2020', '11', '1', '61', '00', '11', '172')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs hour param test failed'
    )
    assert.notStrictEqual(result, null, 'get logs hour param test failed')
    assert.strictEqual(result.status, 422, 'get logs hour param test failed')

    result = await cases.getLogs('2020', '11', '1', '00', '61', '11', '172')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs minute param test failed'
    )
    assert.notStrictEqual(result, null, 'get logs minute param test failed')
    assert.strictEqual(result.status, 422, 'get logs minute param test failed')

    result = await cases.getLogs('2020', '11', '1', '00', '60', '61', '172')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs second param test failed'
    )
    assert.notStrictEqual(result, null, 'get logs second param test failed')
    assert.strictEqual(result.status, 422, 'get logs second param test failed')

    result = await cases.getLogs('2020', '11', '1', '00', '60', '60', '1000')
    assert.notStrictEqual(
      typeof result,
      'undefined',
      'get logs millisecond param test failed'
    )
    assert.notStrictEqual(
      result,
      null,
      'get logs millisecond param test failed'
    )
    assert.strictEqual(
      result.status,
      422,
      'get logs millisecond param test failed'
    )
    console.log('tested get logs params')

    console.log('testing get logs ')
    const dateArr = [
      '2016-01-01T00:00:11.172Z',
      '2016-02-01T00:00:11.172Z',
      '2017-01-01T00:00:11.172Z',
      '2017-02-01T00:00:11.172Z',
      '2018-01-01T00:00:11.172Z',
      '2018-02-01T00:00:11.172Z',
      '2019-01-01T00:00:00.000Z'
    ]
    for (const d of dateArr) {
      const dt = new Date(d)
      result = await cases.getLogs(
        dt.getUTCFullYear(),
        dt.getUTCMonth(),
        dt.getUTCDate(),
        dt.getUTCHours(),
        dt.getUTCMinutes(),
        dt.getUTCSeconds(),
        dt.getUTCMilliseconds()
      )
      assert.notStrictEqual(typeof result, 'undefined', 'get logs failed')
      assert.notStrictEqual(result, null, 'get logs failed')
      assert.strictEqual(result.status, 200, 'get logs failed')
      assert.strictEqual(result.data[0].split(' ')[0], d, 'get logs failed')
    }

    result = await cases.getLogs('2020', '0', '01', '00', '00', '11', '172')
    assert.notStrictEqual(typeof result, 'undefined', 'get logs failed')
    assert.notStrictEqual(result, null, 'get logs failed')
    assert.strictEqual(result.status, 200, 'get logs failed')
    assert.strictEqual(
      result.data[0],
      '2020-01-01T00:00:11.172Z Request received from 211.254.246.209 for /about',
      'get logs failed'
    )
    assert.strictEqual(
      result.data[8],
      '2020-01-01T00:02:25.365Z Querying table posts',
      'get logs failed'
    )
    console.log('tested get logs ')
  } catch (e) {
    console.log(e)
  } finally {
    process.exit(0)
  }
}

start()
