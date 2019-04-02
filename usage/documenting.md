# Documenting APIs

Once you've integrated Optic into your API, you can use the CLI to document the API at any time. 

Set your working directory to the root directory of the API (where your `optic.yml` file lives). Then run:
```bash
optic api:document
```

That command will begin a documentation session. 
1. Optic will start listening for requests / responses that get logged by the Optic middleware you've added to your test suites
2. Optic will run your test command from `strategy.commandToRun` in the `optic.yml`. The test session will run until your tests finish. 
3. Once your tests finish, Optic will save it's observations about your API Contract in `.optic/observations.json`. You can add the `.optic` directory to your `.gitignore`.

### Viewing the API Docs 
To view the API Docs generated from your tests run 
```bash
optic api:publish --draft 
```  

This will publish a snapshot version of your API to Optic's website so you can view the contract. 


### Publishing an API Version
When you're ready to publish a new version of your API, run 
```bash
optic api:publish
```

The version is set in your `optic.yml` file as `api.version`.

Once uploaded your teammates will be notified of the new version.  
