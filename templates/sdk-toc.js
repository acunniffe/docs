module.exports = (sdks, basePath) => `
# Optic Documentation SDKs
${sdks.map(i => `   - [${i.name}](${i.fileName.replace(basePath+'/build/', '')})`).join('\n')}

Don't see a stack you use? If you have an hour or two to spare, you can [contribute it to the community here](example-fixtures/contributing.md).

`.trim()
