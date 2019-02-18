# API Setup
To document your API with Optic, you need to include an 'optic.yml' file in the root directory of that API. This file provides Optic with the information it needs to accurately document your API. 

Here's an example of an 'optic.yml' file: 

```yaml

# If using the Logging Strategy
strategy:
  type: logging
  commandToRun: sbt test # The command used to execute the API tests
  
# If using the proxy Strategy
strategy:
  type: proxy
  targetHost: localhost # The host of your mock API
  targetPort: 3005 # The port of your mock API
  commandToRun: sbt test # The command used to execute the API tests 

api:
  id: api-slug # The name of your Optic project team/api for team projects. 
  paths:
    - /users
    - /users/login
    - /users/:userId/followers
```

## Validating your optic.yml
The Optic CLI can validate the structure of your `optic.yml` file. Set your working directory to the root directory of your API and run: 
```bash
optic config:check
checking /path/to/optic.yml
Everything looks ok!
```

If the API configuration is invalid, Optic will provide feedback to assist. 
```bash
optic config:check
checking /path/to/optic.yml
 ›   Error: child "testCommand" fails because ["testCommand" is required]
```

## Paths
Optic lets you specify which endpoints should be included in your documentation by adding entries to the paths array. Optic will try to match each request it observes with one of these paths. If one or more requests is observed that match a path, it will be included in the documentation. If you have multiple operations that use the same path, but different HTTP Methods, you don't have to use duplicate entries.

For example:
```yaml

api:
  paths:
    - /users 
    # Matches POST /users
    # Matches GET  /users
    # Matches PUT  /users
  
    - /users/:userId/followers
    # Matches GET /users/user1/followers
    # Matches POST /users/user1/followers
  
    # Does not match GET  /model/:item/:property
    # Does not match POST /authenticate
```

These path strings conform to version 3.0.0 of [path-to-regexp](https://www.npmjs.com/package/path-to-regexp), a popular npm package with over 10 million weekly downloads. There is an [online sandbox](http://forbeslindesay.github.io/express-route-tester/) that can help you validate your paths.

While all options in path-to-regexp are supported, most API paths will only need to include the provided named parameters syntax ':name'. Here are some examples to review:

```yaml
api: 
  paths:
    - /users/:id
    # Matches /users/123
    # Matches /users/abc
    # Matches /users/456?query_param=true
  
    # Does not match /users:abc
    # Does not match /users/123/profile
  
    - /trips/from:cityA-to:cityB
    # Matches /trips/from:toronto-tophiladelphia  
    # Matches /trips/from:london-tophiladelphia  
    # Does not match /trips/from/london/to/philadelphia  
```

## Authentication
To setup the authentication scheme for you API you need to add a `security` array to `api`. You can read more in [our authentication docs](authentication.md).
