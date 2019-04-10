# Setting up your optic.yml
The `optic.yml` file has two main keys that configure Optic. 
1. `document` (optional) Configures how an API is documented by Optic
2. `consume` (optional) Serves as the manifest for all the API dependencies a project needs. 

Let's take a look at each of these use cases in more detail. 

## Document 
Before Optic can document an API, it needs to be provided with some basic information. 

**id** (if you plan on publishing) - The slug for your API. Format is either `my-api` or `my-org/api` 

**version** (version) - A semantic version for the API  

**run_tests** - The command used to start the project's tests.

**paths** - The paths Optic should document. Each entry must follow the [path-to-regex format](https://www.npmjs.com/package/path-to-regexp). 
- Document all methods for path: `/users/:userId`
- Document a specific method for a path: `get /users/:userId`



That's it! Optic will learn your API contract by watching the traffic between your API and your running tests. If you've [written even simple tests](/setup/testing-guidelines.md), you'll get great docs. 
 
```yaml
document:
  id: my-api
  version: 1.0.0
  run_tests: npm run test
  paths: 
    - /users/:user-id                   # Get,Post,Put,Delete,Patch  :user-id is a url param
    - get /accounts/:id/profile/:key    # Get, :id and :key are url params
    - post /login                       # Post, no params
```

## Consume
After you've documented and published your APIs on Optic, you can consume our automatically generated API clients from other projects. For instance, you could include an API Client on your React frontend that connects to your Flask API. 

To save time, you can use the `api:add` command to add new API dependencies:
```bash
> optic api:add company/flask-api --generate js-client
```

Running `api:add` creates a new key in the consumes object. Each key contains:
- **version** - the version of the API you want to consume (corresponds to version in the `document` config)
- **generate** - the list of artifacts you want Optic to generate based on the API. Each key is the id of the artifact and the value is the path relative to the root of your project where you want the artifact generated. For instance `js-client: src/managed/flask-api-client` will generate the javascript Api client for this version of my API in `src/managed/flask-api-client`

```yaml
consume:
  company/flask-api:
    version: 1.0.0
    generate:
      - js-client: src/managed/flask-api-client
  company/auth-api:
    version: 1.0.0
    generate:
      - js-client: src/managed/flask-api-client
```
