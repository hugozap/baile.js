/* Builds baile.js and baile.min.js */

var fs = require('fs')
var path = require('path')
var Uglify = require('uglify-js')
var coreContents = fs.readFileSync(path.join(__dirname,'core.js'),'utf8')
var utilContents = fs.readFileSync(path.join(__dirname, 'utils.js'),'utf8')
var restyleContents = fs.readFileSync(path.join(__dirname,'vendor', 'restyle.js'),'utf8')

var merged = `
(function() {
	${utilContents}
	${restyleContents}
	${coreContents}
})();
`

fs.writeFileSync(path.join(__dirname,'dist','baile.js'), merged, 'utf8')
fs.writeFileSync(path.join(__dirname,'test','baile.js'), merged, 'utf8')
var mini = Uglify.minify(merged, {fromString: true}).code;
fs.writeFileSync(path.join(__dirname,'dist','baile.min.js'), mini, 'utf8')
console.log('ok');