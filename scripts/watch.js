import watch from 'watch'
import path from 'path'
import cp from 'child_process'
const debug = require('debug')('watch')

const ROOT = path.resolve(__dirname, '..')

// --------------------------------
// Command
// --------------------------------
const commandString = process.argv[2]
const commandArray = commandString.split(' ')
const command = commandArray.shift()
const args = commandArray

debug(commandString)

// --------------------------------
// Process
// --------------------------------
let cmd
const restartCommand = () => {
  if (cmd && typeof cmd.kill === 'function') cmd.kill()

  cmd = cp.spawn(command, args, { cwd: ROOT, stdio: 'inherit' })
    .on('exit', code => {
      debug(typeof code === 'number' ? `exited with code ${code}` : 'killed')
    })
}

// --------------------------------
// Watch
// --------------------------------
const options = {
  ignoreDotFiles: true,
  ignoreNotPermitted: true,
  ignoreUnreadableDir: true,
  filter: (file, dir) => {
    const isExcluded = [
      /dist/,
      /node_modules/,
      /README\.md/,
      /\.log*/,
    ].some(regEx => regEx.test(file))

    if (!isExcluded) debug(file)
    return !isExcluded
  },
}

watch.watchTree(ROOT, options, (file, curr, prev) => {
  restartCommand()
})
