# Optic -- API Automation for the Modern Team
Optic documents any REST API automatically using a proxy server. When you run your project's tests through the Optic CLI it stands in the middle of your test process and mock API server. It collects every Request/Response pair and merges them into an accurate API Spec. 

The only requirement is that you've written good tests with ample coverage of the API. 

Instead of making you manually document the API, or asking you to add messy annotations all over your code, Optic uses the tests you've (hopefully) already written to learn the API Spec. We believe the only API Spec that matters is one based on real behavior learned at runtime. 

Optic takes 15 minutes to setup and works with any tech stack and once configured you:
- Get accurate API Specs, that are always up to date
- Never have to write another API Spec manually
- The benefits of self-documenting frameworks, w/o migrating to one


## Getting Started
- [Install Optic](setup/install.md)
- [Adding APIs](setup/adding-apis.md)
