import { spawn } from 'child_process'
import ps from 'ps-node'

export async function sleep(milliseconds=100) {
  return await new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function searchForProcess(command) {
  return await new Promise((resolve, reject) => {
    ps.lookup({ command }, function(err, resultList) {
      if (err)
        return reject(err)
      resolve(resultList[0])
    })
  })
}

export async function killProcess(pid) {
  return new Promise((resolve, reject) => {
    ps.kill(pid.toString(), err => {
      if (err)
        return reject(err)
      resolve(pid)
    })
  })
}

export function startProcess(command) {
  const proc = spawn('sh', ['-c', command], { detached: true, stdio: 'ignore' })
  proc.unref()
  return proc
}
