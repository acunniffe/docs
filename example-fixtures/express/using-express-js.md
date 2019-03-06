# Using Optic with Express JS

> Tested against [Express](https://expressjs.com/) 4.x

## Optic Setup
You can use Optic to document any Express JS App written in JavaScript, TypeScript or ReasonML. To get started, install our [npm module](https://www.npmjs.com/package/@useoptic/document-express) for adding our documenting middleware to your Express App: 
```bash
npm install @useoptic/document-express --save-dev
``` 

If you'd like to review the source for this package, it's [available on our GitHub](https://github.com/opticdev/node-express-fixture). If you have any problems getting it working please open an issue or make a PR. 

To use add the middleware, just wrap your `app` in `withOptic`. The `withOptic` function will only apply our middleware to your API if you are running your tests through `optic api:document`. 

```javascript
import withOptic from '@useoptic/document-express'
//Express App used in Production
import {app} from '../server.js'

//Use this instance in your tests
const appWithOptic = withOptic(app) 

//Example Test
it('can get a list of users', (done) => {
    request(appWithOptic)
       .get('/users')
       .expect(200, done)  
})

```

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)
