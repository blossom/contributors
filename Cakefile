fs      = require 'fs'
{spawn} = require 'child_process'
uglify  = require 'uglify-js'

task 'watch', 'Continously compile CoffeeScript to JavaScript', ->
  command = spawn 'coffee', ['--compile', '--watch', '--lint', '--output', 'lib', 'src']
  command.stdout.on 'data', (data) ->
    console.log "#{data}"
  command.stderr.on 'data', (data) ->
    console.log "#{data}"
  command.on 'error', (error) ->
    console.log "#{error.stack}"
    process.exit -1

  testCommand = spawn 'coffee', ['--compile', '--watch', '--lint', '--output', 'test/spec', 'test/src']
  testCommand.stdout.on 'data', (data) ->
    console.log "#{data}"
  testCommand.stderr.on 'data', (data) ->
    console.log "#{data}"
  testCommand.on 'error', (error) ->
    console.log "#{error.stack}"
    process.exit -1

task 'minify', 'Create minified version of contributors in lib', ->
  source = fs.readFileSync 'lib/contributors.js'
  abstractSyntaxTree = uglify.parser.parse "#{source}"
  abstractSyntaxTree = uglify.uglify.ast_mangle abstractSyntaxTree
  abstractSyntaxTree = uglify.uglify.ast_squeeze abstractSyntaxTree
  source = uglify.uglify.gen_code abstractSyntaxTree

  header = """
          /* contributors 0.1.0
          (c) 2011 Nikolaus Graf, blossom
          contributors may be freely distributed under the MIT license.
          http://blossom.github.com/contributors/
          */
          """

  source = "#{header}#{source}"

  fs.writeFile('lib/contributors.min.js', source, (error) ->
    throw error if error
    console.log 'Minified contributors'
  )
