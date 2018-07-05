import minimist from 'minimist'
import { spawn } from 'child_process'
import UtilizationListener from 'utilization-listener'
import { searchForProcess, killProcess, startProcess, sleep } from './Helpers'

const argv              = minimist(process.argv.slice(2))
const type              = argv.type || 'memory'
const startRedisCommand = argv.start || 'startredis'
const commandFilter     = argv.filter || 'redis-server'
const interval          = parseFloat(argv.interval || 250)
const percentThreshold  = parseFloat(argv.threshold || 99)

;(async function() {
  let restarting = false
  let consecutiveHighUtilizationCounter = 0
  await UtilizationListener().start({ type, interval, percentThreshold }, async function highUtilCb(threshold) {
    if (restarting)
      return

    consecutiveHighUtilizationCounter++

    const redisServerProcess = await searchForProcess(commandFilter)
    if (redisServerProcess && consecutiveHighUtilizationCounter > 20) {
      restarting = true
      consecutiveHighUtilizationCounter = 0

      // restart redis server
      await killProcess(redisServerProcess.pid)
      await sleep(500)
      startProcess(startRedisCommand)

      // used for testing
      if (process.send)
        process.send({ type: 'restarted', pid: redisServerProcess.pid })

      restarting = false
    }

  }, function lowUtilCb(threshold) {
    consecutiveHighUtilizationCounter = 0
  })
})()
