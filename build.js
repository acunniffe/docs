const getJson = require('get-json');
const {ingestionCommit, ingestionRepo} = require('./dependencies');
const rp = require('request-promise');
const manifestUrl = `${ingestionRepo}/${ingestionCommit}/manifest.json`;
const fs = require('fs-sync');
const path = require('path')

const buildDir = path.join(__dirname, 'build')

//Clean and Create build directory
fs.remove(buildDir)
fs.mkdir(buildDir)

//Copy contents into build dir
fs.copy(__dirname, buildDir)

//Delete scripting to reduce artifact size
fs.remove(path.join(buildDir, 'node_modules'))
fs.remove(path.join(buildDir, 'package.json'))
fs.remove(path.join(buildDir, 'package-lock.json'))
fs.remove(path.join(buildDir, 'build.js'))

const docUrl = (docpath) => `${ingestionRepo}/${ingestionCommit}/${docpath}`;

//Lookup API Ingestion manifest
getJson(manifestUrl, (err, manifest) => {

	//Load in all Readmes
	Promise.all(Object.entries(manifest).map(i => {
		const key = i[0];
		const value = i[1];

		const docs = docUrl(value.documentation);
		console.log(docs);

		return rp(docs)
			.then(readme => {
				return {...value, readme};
			});
	})).then(docs => {


	}).catch((err) => {
		console.error(err)
		process.exit(1)
	})

});
