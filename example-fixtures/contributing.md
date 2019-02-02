# Contributing Example Fixtures
> Optic is an MIT Licensed Open Source Project. Like other opens source tools, we're committed to offering free-forever versions of Optic. We'll be building our business around offerings aimed at larger teams and support packages.

If you're a fan of the project, one of the best ways to contribute is by setting up Optic to work with another tech stacks and documenting what you learn. It might take you an hour or two to figure out how to route all your tests through the Optic Proxy, but those leanings can make it possible for other users to pick-up Optic in 10 minutes. The more teams that use Optic, the more that contribute back to the main project and related sub-projects. 

You can see the list of Stacks that are currently documented in the table of contents on the left of this page. If a stack you like has not been documented, just add it with [a PR on this Repo's GitHub](https://github.com/opticdev/docs).

If you document a new stack and your PR is approved we'll send you a **$40 Amazon Gift Card & some Optic Swag as a thank you from the community**. 

## Organization 
Documentation is organized as follows **language/api-framework/test-framework**. For example: 

- **node** / **express-js** / **supertest.md**
- **ruby** / **rails** / **airborne.md**
- **scala** / **akka-http** / **akka-route-testkit.md**

When you submit your pull request please organize it in accordance with the above conventions. Please also add the entry to `_sidebar.md` so it shows up on the table of contents. 

## Documentation Structure
Please follow this template for documentation:

```markdown
# Using Optic with {API Framework} and {Test Framework}
**Special thanks to [your_name_or_username](github/you) for documenting this stack
> Tested against {API Framework} {Version} and {Test Framework} {Version} -- {Any Other Compatibility Considerations}

## Optic Proxy Setup
How do you setup Optic to work with this stack? 
`Provide Working Example Code`

## Using the Proxy (optional)
What changes, if any, need to be made to API tests that are already written?  

## Considerations (optional)
What are some stack specific considerations the user needs to be aware of?

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yaml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)

```

## Libraries? 
Try to be clever in how you integrate Optic into a stack. We think it's best to aim for short <50 LOC test fixtures that are easy to copy/paste into a codebase. If a stack is going to require a dedicated Optic library, we're willing to pitch in as a financial backer of the project. Email support@useoptic.com and we can get a project like that moving. 
