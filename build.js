const getJson = require('get-json');
const {ingestionCommit, ingestionRepo, contributingDocs} = require('./dependencies');
const rp = require('request-promise');
const manifestUrl = `${ingestionRepo}/${ingestionCommit}/manifest.json`;
const fs = require('fs-sync');
const path = require('path')
const tocGenerator = require('./templates/sdk-toc')
const navbarGenerator = require('./templates/sdk-navbar-toc')

const docsProdPath = 'https://docs.useoptic.com/#/'
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
fs.remove(path.join(buildDir, 'templates'))

const docUrl = (docpath) => `${ingestionRepo}/${ingestionCommit}/${docpath}`;

//Lookup API Ingestion manifest
getJson(manifestUrl, (err, manifest) => {

	//Load in all Readmes
	Promise.all(Object.entries(manifest).map(i => {
		const key = i[0];
		const value = i[1];

		const docs = docUrl(value.documentation);

		const fileName = path.join(buildDir, 'example-fixtures', 'api-ingestion', key+'.md')

		return rp(docs)
			.then(readme => {
				return {...value, readme, fileName};
			});
	})).then(docs => {
		//add a toc
		fs.write(path.join(buildDir, 'example-fixtures', 'index.md'), tocGenerator(docs, __dirname))
		//add to navigation
		fs.write(path.join(buildDir, '_sidebar.md'), navbarGenerator(docs, fs.read(path.join(buildDir, '_sidebar.md')), __dirname))


		rp(docUrl(contributingDocs)).then((body) => {
			fs.write(path.join(buildDir, 'example-fixtures', 'contributing.md') ,body)
		})

		//add each individual doc readme
		docs.forEach(sdk => {
			fs.write(sdk.fileName, sdk.readme)
		})

		//creates the integration_docs.json for websites to reference
		fs.write(path.join(buildDir, 'integrations_docs.json'), JSON.stringify(docs.map(i => {
			return {link: docsProdPath + i.fileName.replace(__dirname+'/build/', ''), name: i.name}
		})))

	}).catch((err) => {
		console.error(err)
		process.exit(1)
	})

});
