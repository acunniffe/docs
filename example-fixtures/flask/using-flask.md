# Using Optic with Flask

> Requires **strategy: logging** in optic.yml

> Tested against [Flask](http://flask.pocoo.org/) 1.*

## Optic Proxy Setup
Python APIs built on top of Flask are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Flask app so that your integration tests document your code as they execute. 

## Add the Middleware to your Project
Create a new file called `optic_documenting_middleware.py` and copy in the code below. The middleware will log each request/response that hits the API during testing, and send them to your local Optic instance. 

```python
import http
from flask import Flask, request, g

class OpticDocumentingMiddleware(object):
    def __init__(self, app):
        self.app = app
        request_logger = http.client.HTTPConnection('localhost', 30334)
        response_logger = http.client.HTTPConnection('localhost', 30335)

        @app.after_request
        def after(response):
            # Log Request
            request_body = request.data if request.content_length > 0 else None
            request_headers = {k: v for k, v in request.headers.items()}
            path = request.path + "?" + str(request.query_string, 'utf-8')
            request_logger.request(request.method, path, request_body, request_headers)
            logger_response = request_logger.getresponse()
            interactionId = logger_response.read(logger_response.length).decode("utf-8")

            # Log Response
            response_body = response.data if response.content_length > 0 else None
            response_headers = {k: v for k, v in response.headers.items()}
            response_logger_path = "/interactions/" + interactionId + "/status/" + str(response.status_code)
            response_logger.request("POST", response_logger_path, response_body, response_headers)
            response_logger_response = response_logger.getresponse()

            return response
```

### Making the Middleware Run During Testing
Now add the middleware to your Flask App. Since we only want the middleware to run while Optic executes your tests, make sure you wrap it in a check for the `OPTIC_SERVER_LISTENING` environment variable.

We like performing this check within the block where we setup our test config, but you can do it anywhere that makes sense for your app. 
```python
def create_app(test_config=None):

    # Setup Code...

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        if 'OPTIC_SERVER_LISTENING' in os.environ:
            OpticDocumentingMiddleware(app)
        app.config.update(test_config)
    return app
``` 

## Using the Proxy Fixture
The Documenting middleware will document all the requests/responses that your tests run. Since it is integrated at the middleware level there's no need to update any of your tests files or fixtures. 

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)
