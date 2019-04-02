module.exports = (sdks, currentSidebar, basePath) => `
${currentSidebar}
- [**API Integrations**](example-fixtures/index.md)
  - [Contributing SDKs](example-fixtures/contributing.md)
${sdks.map(i => `      - [${i.name}](${i.fileName.replace(basePath+'/build/', '')})`).join('\n')}
`.trim()
