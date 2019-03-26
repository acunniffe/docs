# Using Optic with Rails Application

> Requires **strategy: logging** in optic.yml

> Tested against [Rails](https://rubyonrails.org/) 5

## Optic Proxy Setup
Rails projects or those built on top of [Rack](https://rack.github.io/) are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Rack API so that your integration tests document your code as they execute. 

## Add the Middleware to your Project
Create a new file called `optic_documenting_middleware.rb` and copy in the code below. The middleware will log each request/response that hits the API during testing, and send them to your local Optic instance. 


```ruby
require 'puma/configuration'
require 'net/http'

module OpticTestFixture
  class DocumentingMiddleware
    def initialize(app, options = {})
      @app = app
    end

    def call(env)
      req = Rack::Request.new(env)
      res = @app.call(env)
      # Log request and response
      logRequestAndResponse(req, res)
      # Return Response without changing
      res
    end

    private

    def headerHash(message)
      Hash[*message.select {|k, v| k.start_with? 'HTTP_'}
                .collect {|k, v| [k.sub(/^HTTP_/, ''), v]}
                .collect {|k, v| [k.split('_').collect(&:capitalize).join('-'), v]}
                .sort
                .flatten]
    end

    def addHeaders(headers, request)
      headers.each do |key, value|
        request.add_field(key, value)
      end
    end

    def logRequestAndResponse(req, res)

      # Log Request to Optic
      
      logging_request = Net::HTTP.const_get(req.request_method.capitalize).new(req.fullpath)
      # Include Headers
      addHeaders(headerHash(req.env), logging_request)
      # Include body
      if logging_request.request_body_permitted? && req.body
        logging_request.body_stream = req.body
        logging_request.content_length = req.content_length.to_i
        logging_request.content_type = req.content_type if req.content_type
        logging_request.body_stream.rewind
      end

      # Send request to request logging endpoint
      http = Net::HTTP.new("localhost", 30334)
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      logging_request_response = http.start do
        http.request(logging_request)
      end

      logging_request_response.code
      # Save the ID Optic assigns this request
      interactionId = logging_request_response.body || ""

      # Log Response to Optic
      resStatus, resHeaders, resBody = res

      logging_response = Net::HTTP.const_get("Post").new("/interactions/" + interactionId + "/status/" + resStatus.to_s)
      addHeaders(resHeaders, logging_response)
      if logging_response.request_body_permitted? && resBody
        bodyData = ""
        resBody.each do |line|
          bodyData << line
        end
        logging_response.body = bodyData
        logging_response.content_length = bodyData.bytesize.to_s
      end

      http = Net::HTTP.new("localhost", 30335)
      logging_response_response = http.start do
        http.request(logging_response)
      end

    end

  end
end
```

### Making the Middleware Run During Testing
Now add the middleware to your Rack configuration, in a Rails app it's best to do this in `config/enviroments/test.rb` so the middleware is only used during testing. 

> Note: If you use multiple middlewares, make sure the Documenting Middleware is added at the bottom of the stack so the documentation is accurate. In most cases putting it last in your configuration file is sufficient. 

```ruby
Rails.application.configure do {
  # All your current configuration settings...
  
  # The Documenting middleware. Only used if 'OPTIC_SERVER_LISTENING' flag is found in ENV. 
  if ENV['OPTIC_SERVER_LISTENING']
    config.middleware.use OpticTestFixture::DocumentingMiddleware
  end
}
``` 

> Note for RSpec users: Optic will only document specs of type :request since only integration tests contain enough data to generate REST docs. Specs of type :controller skip the Rack stack so documentation generated from them would be incomplete.  

## Using the Proxy Fixture
The Documenting middleware will document all the requests/responses that your tests run. Since it is integrated at the middleware level there's no need to update any of your tests files or fixtures. 

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)
