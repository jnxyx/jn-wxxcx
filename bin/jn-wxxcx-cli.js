#!/usr/bin/env node

var ejs = require('ejs')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var program = require('commander')
var readline = require('readline')
var sortedObject = require('sorted-object')
var util = require('util')

var MODE_0666 = parseInt('0666', 8)
var MODE_0755 = parseInt('0755', 8)

var _exit = process.exit
var pkg = require('../package.json')

var version = pkg.version

// Re-assign process.exit because of commander
// TODO: Switch to a different command framework
process.exit = exit

// CLI

around(program, 'optionMissingArgument', function (fn, args) {
  program.outputHelp()
  fn.apply(this, args)
  return { args: [], unknown: [] }
})

before(program, 'outputHelp', function () {
  // track if help was shown for unknown option
  this._helpShown = true
})

before(program, 'unknownOption', function () {
  // allow unknown options if help was shown, to prevent trailing error
  this._allowUnknownOption = this._helpShown

  // show help if not yet shown
  if (!this._helpShown) {
    program.outputHelp()
  }
})

program
  .name('wxxcx')
  .version(version, '    --version')
  .usage('[options] [dir]')
  .option('    --git', 'add .gitignore')
  .option('-f, --force', 'force on non-empty directory')
  .parse(process.argv)

if (!exit.exited) {
  main()
}

/**
 * Install an around function; AOP.
 */

function around (obj, method, fn) {
  var old = obj[method]

  obj[method] = function () {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) args[i] = arguments[i]
    return fn.call(this, old, args)
  }
}

/**
 * Install a before function; AOP.
 */

function before (obj, method, fn) {
  var old = obj[method]

  obj[method] = function () {
    fn.call(this)
    old.apply(this, arguments)
  }
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm (msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(msg, function (input) {
    rl.close()
    callback(/^y|yes|ok|true$/i.test(input))
  })
}

/**
 * Copy file from template directory.
 */

function copyTemplate (from, to) {
  from = path.join(__dirname, '..', 'templates', from)
  write(to, fs.readFileSync(from, 'utf-8'))
}

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplication (name, path) {
  var wait = 5

  mkdir(path, function () {

    mkdir(path + '/components', function () {
	    mkdir(path + '/components/t-view', function () {
	      copyTemplate('components/t-view/t-view.js', path + '/components/t-view/t-view.js')
	      copyTemplate('components/t-view/t-view.json', path + '/components/t-view/t-view.json')
	      copyTemplate('components/t-view/t-view.wxml', path + '/components/t-view/t-view.wxml')
	      copyTemplate('components/t-view/t-view.wxss', path + '/components/t-view/t-view.wxss')
	    })
    })

    mkdir(path + '/pages', function () {
	    mkdir(path + '/pages/index', function () {
	      copyTemplate('pages/index/index.js', path + '/pages/index/index.js')
	      copyTemplate('pages/index/index.json', path + '/pages/index/index.json')
	      copyTemplate('pages/index/index.wxml', path + '/pages/index/index.wxml')
	      copyTemplate('pages/index/index.wxss', path + '/pages/index/index.wxss')
	    })
	    mkdir(path + '/pages/shop', function () {
	      copyTemplate('pages/shop/shop.js', path + '/pages/shop/shop.js')
	      copyTemplate('pages/shop/shop.json', path + '/pages/shop/shop.json')
	      copyTemplate('pages/shop/shop.wxml', path + '/pages/shop/shop.wxml')
	      copyTemplate('pages/shop/shop.wxss', path + '/pages/shop/shop.wxss')
	    })
    })

    mkdir(path + '/controllers', function () {
      copyTemplate('controllers/indexController.js', path + '/controllers/indexController.js')
    })

    mkdir(path + '/images', function () {
    })

    mkdir(path + '/interfaces', function () {
      copyTemplate('interfaces/interface.js', path + '/interfaces/interface.js')
      copyTemplate('interfaces/indexITF.js', path + '/interfaces/indexITF.js')
    })

    mkdir(path + '/memory', function () {
      copyTemplate('memory/memory.js', path + '/memory/memory.js')
    })

    mkdir(path + '/models', function () {
      copyTemplate('models/enum-model.js', path + '/models/enum-model.js')
      copyTemplate('models/return-model.js', path + '/models/return-model.js')
      copyTemplate('models/models.js', path + '/models/models.js')
    })

    mkdir(path + '/tools', function () {
      copyTemplate('tools/base-tool.js', path + '/tools/base-tool.js')
      copyTemplate('tools/date-tool.js', path + '/tools/date-tool.js')
      copyTemplate('tools/tools.js', path + '/tools/tools.js')
    })

    copyTemplate('app-config.js', path + '/app-config.js')
    copyTemplate('app.js', path + '/app.js')
    copyTemplate('app.json', path + '/app.json')
    copyTemplate('app.wxss', path + '/tools.wxss')
    copyTemplate('project.config.json', path + '/project.config.json')

  })
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName (pathName) {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory (path, fn) {
  fs.readdir(path, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
}

/**
 * Graceful exit for async STDIO
 */

function exit (code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done () {
    if (!(draining--)) _exit(code)
  }

  var draining = 0
  var streams = [process.stdout, process.stderr]

  exit.exited = true

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1
    stream.write('', done)
  })

  done()
}

/**
 * Load template file.
 */

function loadTemplate (name) {
  var contents = fs.readFileSync(path.join(__dirname, '..', 'templates', (name + '.ejs')), 'utf-8')
  var locals = Object.create(null)

  function render () {
    return ejs.render(contents, locals)
  }

  return {
    locals: locals,
    render: render
  }
}

/**
 * Main program.
 */

function main () {
  // Path
  var destinationPath = program.args.shift() || '.'

  // App name
  var appName = createAppName(path.resolve(destinationPath)) || 'hello-world'

  // Generate application
  emptyDirectory(destinationPath, function (empty) {
    if (empty || program.force) {
      createApplication(appName, destinationPath)
    } else {
      confirm('destination is not empty, continue? [y/N] ', function (ok) {
        if (ok) {
          process.stdin.destroy()
          createApplication(appName, destinationPath)
        } else {
          console.error('aborting')
          exit(1)
        }
      })
    }
  })
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir (path, fn) {
  mkdirp(path, MODE_0755, function (err) {
    if (err) throw err
    console.log('   \x1b[36mcreate\x1b[0m : ' + path)
    fn && fn()
  })
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write (path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}
