# Using Optic with Express JS and Supertest
> Tested against [Express](https://expressjs.com/) 4.x & [Supertest](https://github.com/visionmedia/supertest#readme) 3.x

## Optic Proxy Setup
When you pass Supertest your Express App, it binds to an ephemeral port for the duration of the test. This default testing pattern makes it difficult to redirect traffic through the Optic Proxy. 
```javascript
request(app)
  .get('/test')
  .expect(200)
```

To use Supertest with Optic, we need to create a simple test fixture that directs traffic from Supertest to the Optic Proxy. 

## Proxy Fixture
Create a new file called `OpticTestFixture.js`. This fixture will check for the `optic-watching` flag and, if present, route all your test traffic through the proxy. If the flag is not set, your tests will run normally.

1. **Dependencies** - This fixture requires the `express`, `request` packages.
2. **Optic Proxy Config** - Checks for `optic-watching` flag, sets the location of your local Optic Proxy (always localhost:30333)
3. **withOptic Wrapper** -- Wraps your Express App for use with Supertest. If `optic-watching` is present all traffic will be routed through the proxy to a mock server. The function takes two arguments, your Express App and the test port from your `optic.yaml` file. 

```javascript
//1 Dependencies 
import express from 'express'
import request from 'request'

//2 Optic Proxy Config
const opticWatching = !!process.env['optic-watching']
const opticProxyAddress = 'http://localhost:30333';

//3 withOptic Wrapper
export function withOptic(app, testPort) {
	if (opticWatching) {
		const proxy = express()
		proxy.all('*', (req, res) => {
			let mockServer;
			new Promise((resolve, reject) => {
				mockServer = app.listen(testPort, resolve)
			}).then(() => {
				req
				  .pipe(request.post({baseUrl: opticProxyAddress, uri: req.url}))
				  .pipe(res);

				res.on('finish', () => {
					mockServer.close()
				})
			})
			.catch((err) => {
				throw new Error(err)
			})
		});
		return proxy
	}

	return app
}
```

## Using the Proxy Fixture
The `OpticTestFixture` is designed to work seamlessly with the Supertest interfaces. Just wrap the Express App you are testing with the wrapper and whenever you run Optic the data collected from observing the tests will be used to generate your documentation. 

```javascript
import request from 'supertest'
import app from '../../app'
//without Optic
it('can get a list of users', (done) => {
    request(app)
       .get('/users')
       .expect(200, done)  
})

//with Optic
it('can get a list of users', (done) => {
    request(withOptic(app, 3005))
       .get('/users')
       .expect(200, done)  
})
```

In Supertest you can also setup an instance of your API tester that can be used across multiple tests. 
```javascript
import supertestRequest from 'supertest'
import app from '../../app'

const backendTester = supertestRequest(withOptic(app, 3005))

backendTester.get(...)
backendTester.post(...)
``` 
  
Supertest Agents are also supported by the `OpticTestFixture`. Agents maintain a client session that can be used across multiple tests.  
```javascript
  const agent = supertestRequest.agent(withOptic(app, 3005));
```  

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yaml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)
