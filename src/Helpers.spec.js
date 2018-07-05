import assert from 'assert'
import { spawn } from 'child_process'
import { searchForProcess, killProcess, startProcess, sleep } from './Helpers'

describe("Helpers", function() {
  describe("#searchForProcess is used in the following tests", function() {
    describe("#killProcess", function() {
      it("should properly kill the process we create", async function() {
        this.timeout(5000)

        spawn('sleep', [ '10' ])
        await sleep(500)
        const hasProcessData = await searchForProcess('sleep')
        await killProcess(hasProcessData.pid)
        const hasNoProcData = await searchForProcess('sleep')

        assert.equal('object', typeof hasProcessData)
        assert.equal(true, !!hasProcessData.pid)
        assert.equal(undefined, hasNoProcData)
      })
    })

    describe("#startProcess", function() {
      it("should create a new process that we want to start", async function() {
        this.timeout(5000)

        startProcess('sleep 5')
        const hasProcessData = await searchForProcess('sleep')
        await killProcess(hasProcessData.pid)
        const hasNoProcData = await searchForProcess('sleep')

        assert.equal('object', typeof hasProcessData)
        assert.equal(true, !!hasProcessData.pid)
        assert.equal(undefined, hasNoProcData)
      })
    })
  })
})
