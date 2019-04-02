# Integrating Optic with your API Framework

To document your API with Optic, you need to add our documenting middleware to your API tests. You can find integration guides for popular API Frameworks like Express, Rails, Flask and Akka HTTP [listed here](/example-fixtures/index.md)

## Verifying Setup
We've created a simple CLI command you can use to test if you've integrated Optic into your tests correctly.
```bash
optic setup:tests "command that starts your tests"
``` 

When you run this command Optic will begin a documenting session and wait for your Optic integration to log data to the CLI. If any data is received from your tests, Optic will confirm that you've set it up properly. If all of your tests run and no data is logged back to Optic, Optic assumes your integration is invalid and will suggest ways to fix it. 

