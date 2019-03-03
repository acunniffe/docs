# Contributing Example Fixtures

If you're a fan of the project, one of the best ways to contribute is by setting up Optic to work with another tech stack and documenting what you learn along the way. It might take you an hour or two to figure out how to make your favorite API framework work with Optic, but by sharing those leanings back with the community you make it possible for other developers to pick-up Optic in minutes.

You can see the list of Stacks that are currently documented in the table of contents on the left of this page. If a stack you like has not been documented, just add it with [a PR on this Repo's GitHub](https://github.com/opticdev/docs).

If you document a new stack and your PR is approved we'll send you a **$140 Amazon Gift Card & some Optic Swag as a thank you from the community**. Make sure to review the guidelines below to make sure your PR is approved:  

## Structure of PR
- Create a directory for the API framework you wish to contribute `example-fixtures/${api-framework}` ie `example-fixtures/rails`.
  - add a file called `using-${api-framework}.md`. This is where you'll write the documentation that appears on the site.
- Add an new bullet for your test framework in alphabetical order in both `_sidebar.md` and `example-fixtures/index.md`

## Documentation Structure
Please follow this template for the markdown documentation:
```markdown
# Using Optic with {API Framework}
**Special thanks to [your_name_or_username](github/you) for documenting this stack
> > Requires **strategy: ________** in optic.yml

> Tested against {API Framework} {Version} -- {Any Other Compatibility Considerations}

## Optic Setup
How do you setup Optic to work with this stack? 
`Provide Working Example Code`

## Using the Fixture
What changes, if any, need to be made to API tests that are already written?  

## Considerations (optional)
What are some stack specific considerations the user needs to be aware of?

### Next Steps
1. [Create an API Project](setup/adding-apis.md)
2. Make sure you've [setup an `optic.yml` file](setup/project-setup.md)
3. [Publish an API Snapshot](setup/publishing-snapshots.md)
```

## Libraries? 
Try to be clever in how you integrate Optic into a stack. We think it's best to aim for short <100 LOC test fixtures that are easy to copy/paste into a codebase. We think it only makes sense to publish a dedicated library for Optic for runtime like Node and the JVM where one API framework is used in several different languages. 

If a stack is going to require a dedicated Optic library, we're willing to pitch in as a financial backer of the project. Email support@useoptic.com and we can get a project like that moving. 


