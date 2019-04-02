# Testing Guidelines   

More and more teams have realized the benefits of using integration tests as the specification for their API. Using tests as the source of truth for your API provides a lot of benefits:

- Tests are a great abstraction for defining a contract
- Tests are directly coupled to your code. This is a built-in guard against doc drift.
- Tests verify the actual behavior of your API making them more accurate than a manually written Swagger.
- Your CI/CD environment is already setup to run your tests -- producing a documentation artifact from tests is a natural next step.
- You hopefully already have them :) And if you don't, writing them is already a goal.

The obvious drawback of using tests as the API contract is that other developers need to be able to download and understand your code which often is not feasible. Optic overcomes this limitation by generating a documentation artifact built from your tests. This means you can write your API contract as tests and use Optic to document and share that contract with other developers.    

**Our promise: If you have integration tests for your API, Optic write and maintain an accurate API specification for your team.**

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

In addition to giving you confidence in your code, you can think of your tests as providing the dataset Optic uses to infer your API contract. It's likely that your tests already have good coverage of your API's functionality, but in the event they do not, here are some guidelines that will help you write better tests & get a complete API Contract from Optic:

**What to focus on**: 
- Test your apps by mocking API requests/responses, not just your internal libraries that handle the requests. 
- Test every API Endpoint you want included in your API Spec
- Test the possible response codes for each endpoint. For responses shared across many endpoints like `403`, it's helpful to create reusable tests that you can share across endpoints.    

**What does not matter to Optic**: 
Your tests don't need to assert everything you want included in your API Spec. For instance if you assert the status code of a response is 200 and you don't assert anything about the body or response headers of that response -- the entire response will still be documented. Optic discovers your API Contract by looking at the traffic flowing through your app -- not your assertions about that data. 
