# Using Optic with Rails Application


> Tested against [Rails](https://expressjs.com/) 2.3, 2.4, 2.5

## Optic Proxy Setup
Rails projects or those built on top of [Rack](https://rack.github.io/) are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Rack API so that your integration tests document your code as they execute. 

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'optic-middleware'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install optic-middleware
    
    
If you'd like to review the source for this gem, it's [available on our GitHub](https://github.com/opticdev/ruby-rack-fixture). If you have any problems getting it working please open an issue or make a PR.   


### Making the Middleware Run During Testing
Now add the middleware to your Rack configuration, in a Rails app it's best to do this in `config/enviroments/test.rb` so the middleware is only used during testing. 

> Note: If you use multiple middlewares, make sure the Documenting Middleware is added at the bottom of the stack so the documentation is accurate. In most cases putting it last in your configuration file is sufficient. 

```ruby
require 'optic/middleware'

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
