# Adding API Dependencies \[Experimental\]
After you've published versions of your API, Optic can help you consume that API from other projects. We've tried to make this as easy as installing a dependency in your project. 

> Currently we only generate Javascript SDK clients. More SDKs types coming soon. 

### Adding 
Each Optic API has an `id` and `version` field defined in its `optic.yml` file. These fields are used to reference the API from another project. To add an API dependency to your project, run:  

```bash
optic api:add my-team/api 0.1.0
```

This command will produce an updated `optic.yml` with a `dependencies` section: 
```yaml
dependencies:
    - id: my-team/api
      version: 0.1.0
```

### Installing SDKs
When you're ready to install the SDKs, run:
```bash
optic api:install --outputDirectory="src/managed"
Generating js-api-client@0.1.2 in /Users/test/my-app/src/managed/js-api-client:

├── README.md
├── package.json
├─┬ src
│ └── Client.js
└─┬ docs
  ├── getSelfApiByApiSlug.md
  ├── getSelf.md
  ├── getSelfApiTokens.md
  └── postSelfApiToken.md

Generating artifacts... done
```

The install command generates the source code and usage documentation for the SDKs in the `outputDirectory` you pass it.

### Updating SDKs
Whenever a new version of an API you depend on is published, you can update the entry in the `optic.yml` and run `optic api:install` again. This will update the SDK to the latest version.  

```yaml
dependencies:
    - id: my-team/api
      version: 0.1.1    # updated from 0.1.0
```
