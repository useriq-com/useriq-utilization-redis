import assert from 'assert'
import { fork } from 'child_process'
import { sleep, startProcess } from './Helpers'

describe("index.js", function() {
  it("should monitor my task and restart the process after 20 iterations of of utilization crossing threshold", async function() {
    this.timeout(10000)

    let timesRestarted = 0
    await new Promise(async (resolve, reject) => {
      await startProcess('sleep 10')

      const child = fork('./index', [
        '--threshold', '0.01',
        '--start', 'sleep 10',
        '--filter', 'sleep',
        '--interval', '5'
      ])

      child.on('message', data => {
        assert.equal('restarted', data.type)
        timesRestarted++
      })
      child.on('error', err => reject(err))
      child.on('disconnect', info => resolve(info))

      await sleep(8000)
      child.kill()
    })

    assert.equal(true, timesRestarted > 0)
  })
})
