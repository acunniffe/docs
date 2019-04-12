# Quick Start
> Average setup time: 18 minutes. <br/>If you need help at any time reach out on Intercom (the little chat widget at the bottom right)

#### 1. Install the Optic ClI
Install the Optic CLI to document all your APIs.
```bash
npm install @useoptic/cli -g
``` 

#### 2. Navigate to your API Repo
```bash
cd path/to/repo
```

#### 3. Add an optic.yml file
Use the `init` command to create your `optic.yml` file. This step configures how your API is documented.
```bash
optic setup:init
```

#### 4. Add Optic to your API Tests
Before Optic can document your API, you will need to add our library to your API codebase. These libraries hook into your API tests and log the shapes of every request and response to Optic for documenting. 

<a href="/#/example-fixtures/index" target="_blank">Learn how to connect Optic to your API Tests</a>

You can verify whether Optic has been integrated properly by running:
```bash
optic setup:tests
``` 

Once you confirm that data from your tests is being forwarded to the CLI you can move on to the next steps to learn about documenting and publishing your APIs. 

#### 5. Document the API
Once Optic has been added to your API tests you will be able to run the document command:
```bash
optic api:document
```

The document command just runs your tests using the command you give it in `run_tests` within the `optic.yml` file. However, you run the tests using Optic, it collects every request and response to your API. It uses the shape of these test requests to learn an accurate API contract. 

Once your test command completes, Optic will tell you how many API interactions to observed.

#### 6. Publishing
Once you've documented an API with Optic, you can publish it privately to our website and share it with your team, or you can publish it locally on your personal computer. Once an API is published you can:
- Use the published version to generate yourself an API client ie `optic api:add my-backend --generate js-client`
- Share it with your team so everyone has accurate docs for the API
- Add descriptions and paragraph-form docs to the API contract. 

To publish to Optic's website and take advantage of our web UI:
```bash
# connect the CLI to your Optic account
optic auth:login 
# publish the API
optic api:publish
```

If you want to publish the API version locally for now, just run:
```bash
optic publishLocal
```

<br />
<br />

> That's it! If you have any questions reach out to us on Intercom (the little chat widget on the bottom right)

