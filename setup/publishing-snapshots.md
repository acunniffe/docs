# Publishing Snapshots
By observing the behavior of your API, Optic can discover contract for your API. These contracts are uploaded to Optic as a 'snapshot' of your API at its current state of development.

> Optic uses ${API_REPO_ROOT_DIRECTORY}/.optic to log its observations about your API. Please should add this directory to your `.gitignore` so your git history remains clean. 

## Documenting API
To document your API, set your working directory to the root directory of your API and run: 
```bash
optic api:document
Collecting API Interactions:...
I observed 52 API interactions!
Generating reports...... Done!
```

Optic will run your tests and observe the behavior of your API. These leanings will be saved to `.optic/observations.json`. 

## Publishing 
When you are ready to publish a new version of your API to Optic run: 
```bash
optic api:publish
optic publish
``` 

The snapshot will be named after the current Git branch / commit. If you want to preview the API docs on Optic without publishing, pass the `--draft` flag to the publish coommand.  

Once published: 
- Team members who have subscribed to this API will get notified of important changes
- (beta) Pull requests will be made to update clients that consume this API

