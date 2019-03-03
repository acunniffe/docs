# Testing Guidelines   

More and more teams have realized the benefits of using integration tests as the specification for their API. Using tests as the source of truth for your API provides a lot of benefits:

- Tests are a great abstraction for defining a contract
- Tests are directly coupled to your code. This is a built-in guard against doc drift.
- Tests verify the actual behavior of your API making them more accurate than a manually written Swagger.
- Your CI/CD environment is already setup to run your tests -- producing a documentation artifact from tests is a natural next step.
- You hopefully already have them :) And if you don't, writing them is already a goal.

The obvious drawback of using tests as the API contract is that other developers need to be able to access and understand your code. Optic overcomes this limitation by generating a documentation artifact built from monitoring your tests as they execute. This means you can write your API contract as tests and use Optic to document and share that contract with other developers.    

**Our promise: If you have integration tests for your API, Optic will maintain an accurate API specification for your team.**

## What to Test
Any repository that exposes an API should include some form of integration tests that verify the API contract. Good API integration tests treat the API as a blackbox and assume the role of an API consumer. They mock requests, and account for the full range of responses each endpoint produces. 

Here are some examples of integration tests from Optic's Scala backend. 

```scala
describe("team lookup (get /teams)") {
  it("responds with 200 and the new team with valid request") {
    usesFixture
    validRequest ~> Router.teamRouter ~> check {
      assert(status == StatusCodes.OK)
      assert(responseEntity.contentType == ContentTypes.`application/json`)
      assert(responseIsJsonOf[OpticTeam])
    }
  }

  it("responds with 404 if team is not found") {
    usesFixture
    authorized(Get("/teams/abc")) ~> Router.teamRouter ~> check {
      assert(status == StatusCodes.NotFound)
    }
  }
}
```

In addition to giving you confidence in your code, you can think of your tests as providing the dataset Optic uses to discover your API contract. It's likely that your tests already have good coverage of your API's functionality, but in the event they do not, here are some guidelines that will help you write better tests & get a complete API Contract from Optic:

What to focus on: 
- Test your apps by mocking API requests/responses, not just your internal libraries that handle the requests. 
- Test every API Endpoint you want included in your API Spec
- Test the possible response codes for each endpoint. For responses shared across many endpoints like `403`, it's helpful to create reusable tests that you can share across endpoints.    

What does not matter to Optic: 
Your tests don't need to assert everything you want included in your API Spec. For instance if you assert the status code of a response is 200 and you don't assert anything about the body or response headers of that response -- the entire response will still be documented. Optic discovers your API Contract by looking at the traffic flowing through your app -- not your assertions about that data. 


## Creating Optic Test Fixtures
When Optic runs your tests it passes an environment variable into your app called `OPTIC_SERVER_LISTENING`. You'll need to create a test fixture that logs every request/response to your local Optic instance whenever the tests run. 

There's a list of [fixtures built for popular stacks by our community here](/example-fixtures/index.md). If you don't see your fixture on the list [consider contributing one for your favorite language/framework](/example-fixtures/contributing.md).


## How Optic Works
Optic provides two distinct strategies for documenting your API Contract through tests. The internals of your test framework will determine which one you should use: 

1. Logging strategy -- logs each request and response using some kind of middleware. This strategy is used for test frameworks that inject mock requests directly into routers without hitting the network.    
2. Proxy strategy -- redirects test traffic through a local proxy server which collects each request/response. This strategy is used for test frameworks that bind your API to a local port and runs mock tests against them. 

### Logging Strategy
When using this strategy, Optic binds to two ports, one to log requests, and one to log responses. You'll need to setup the simple flow outlined below to log each request/response pair to Optic.  

- Apply custom middleware to your test framework that will forward each request to the **Request Logger** (localhost:30334). 
- The **Request Logger** will respond with an `interactionId` in the body. 
- Run the request through your app's router and save the response.
- Use the **Response Logger** (localhost:30335) to save the response by calling `POST localhost:30335/interactions/{interactionId}/status/{response.statusCode}`. In that request include the headers, and body returned by your server. Optic associates the response to the request you sent the **Request Logger** by using the `interactionId`. 
- Pass the request and response on to the next middleware

Here are some examples of this flow implemented in two popular frameworks: 
- [Akka HTTP](example-fixtures/akka-http/using-akka-http.md)
- [Express](example-fixtures/express/using-express-js.md)
- [Flask](example-fixtures/flask/using-flask.md)
- [Rails](example-fixtures/rails/using-rails.md)

#### Using the Logging Strategy  
To use the logging strategy setup a test fixture like those described in the previous section and change your `optic.yml` file to set `strategy` to `logging`.  
```yaml
strategy: 
  - type: logging
```


### Proxy Strategy
When using this strategy, a local proxy server is setup to forward request from your tests to your mock API. The proxy logs the request/response of every interaction with your API and uses that real-world data to document the API. 

#### Connecting your Tests to the Proxy  
When you run your tests through Optic there will be an environment variable present called 'OPTIC_SERVER_LISTENING'. Your test fixture should be adapted to forward your requests to the Optic Proxy whenever that environment variable is present. 

The Optic proxy always runs on **localhost:30333** so you'll need to redirect test traffic there whenever Optic is watching your project. The proxy will then forward your requests to your mock API based on the entry in your 'optic.yml' file:

```yaml
host: localhost
port: 3001
```

When your mock API responds, Optic will log the response and send it back as the response to the original request.  

## Support
If you need help getting your tests connected to Optic, reach out to us on Drift (bottom right of the screen) or email support@useoptic.com.
