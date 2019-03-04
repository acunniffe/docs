# Using Optic with Akka HTTP
> Requires **strategy: logging** in optic.yml

> Tested against [Akka HTTP](https://doc.akka.io/docs/akka-http/current/) 10.x.x
## Optic Proxy Setup
The Akka Route TestKit provides a DSL for injecting requests into your routes and making assertions about the responses.
```scala
it("/hello responds with 'World!'") {
    Get("/hello") ~> helloRoute ~> check {
      assert(responseAs[String] ==  "World!")
    }
}
```
We need to collect the request + response for each test we run and forward them to Optic. Akka's [Logging Directives](https://doc.akka.io/docs/akka-http/current/routing-dsl/directives/debugging-directives/logRequest.html) make it easy to create a simple test fixture that does just that.

## Proxy Fixture
Add a new file in your `test/scala` folder called `OpticFixture.scala`. We suggest using `com/useoptic/akkahttp` to separate it from your code.

The fixture will check for the `OPTIC_SERVER_LISTENING` environment flag and, if present, log your test requests/responses to Optic. If the flag is not present, your tests will run normally.

Review, and then copy this fixture into `OpticFixture.scala`

```scala
package com.useoptic.akkahttp

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.Host
import akka.http.scaladsl.server.RouteResult.Complete
import akka.http.scaladsl.server.{Route, RouteResult}
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.stream.ActorMaterializer
import scala.concurrent.ExecutionContext.Implicits.global

object OpticFixture {

  //If 'OPTIC_SERVER_LISTENING' enviroment flag is set
  //this method wraps a 'Route' instance with a logging directive that forwards data to Optic
  def withOptic(route: akka.http.scaladsl.server.Route): Route = {
    import akka.http.scaladsl.server.directives.{DebuggingDirectives, LoggingMagnet}
    if (sys.env.contains("OPTIC_SERVER_LISTENING"))
      DebuggingDirectives.logRequestResult(LoggingMagnet(_ => logRequestAndResponse))(route)
    else route
  }

  //Standard Configuration for the Optic Proxy Server
  def forwardToRequestLogging(request: HttpRequest) = request.withUri(request.uri.withHost("localhost").withPort(30334).withScheme("http"))
  def forwardToResponseLogging(request: HttpRequest) = request.withUri(request.uri.withHost("localhost").withPort(30335).withScheme("http"))

  private implicit val testActorSystem = ActorSystem("optic-proxy-routing")
  private implicit val materializer = ActorMaterializer()

  //Pipes the Request + Response to the logging endpoints on the local Optic Proxy
  private def logRequestAndResponse(request: HttpRequest)(res: RouteResult): Unit = {
    res match {
      case Complete(response) => {
        val updatedRequest = forwardToRequestLogging(request)

        //Requests are forwarded to the request logging port
        Http().singleRequest(updatedRequest).foreach(i => {
          //A 'interactionId' is sent back in the request body
          Unmarshal(i.entity).to[String].foreach(interactionId => {
            //The response is forwarded to :{response logging port}/response/:interactionId/:statusCode
            val a = Http().singleRequest(forwardToResponseLogging(HttpRequest(
              HttpMethods.POST,
              Uri("/interactions/" + interactionId + "/status/" + response.status.intValue().toString),
              response.headers,
              HttpEntity.apply(response.entity.contentType, response.entity.dataBytes),
              response.protocol
            )))

          })
        })
      }
      case _ => //Rejected requests are ignored
    }
  }
}
```

## Using the Proxy Fixture
The `OpticFixture` is designed to work seamlessly with the Route TestKit DSL. Just wrap the `Route` instances you want included in your documentation like this:  

```scala
import com.useoptic.akkahttp.OpticFixture.withOptic
it("/hello responds with 'World!'") {
    Get("/hello") ~> withOptic(helloRoute) ~> check {
      assert(responseAs[String] ==  "World!")
    }
}
```

The Optic enabled `Route` returned by `withOptic` can be reused as many times as you'd like. Here's an example of typical pattern for injecting Optic into your existing tests. 
```scala
import com.useoptic.akkahttp.OpticFixture.withOptic

val documentedHelloRoute = withOptic(helloRoute)

it("/hello responds with 'World!'") {
    Get("/hello") ~> documentedHelloRoute ~> check {
      assert(responseAs[String] ==  "World!")
    }
}

it("/hello with query name=Bob responds with 'Hello Bob!'") {
    Get("/hello?name=Bob") ~> documentedHelloRoute ~> check {
      assert(responseAs[String] ==  "Hello Bob!")
    }
}

```

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yaml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)