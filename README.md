<p align="center">
    <a href="https://github.com/marketplace/actions/use-herald-action">
      <img src="https://img.shields.io/badge/Marketplace-v1-undefined.svg?logo=github&logoColor=white&style=flat" alt="GitHub Marketplace" />
    </a>
    <a href="https://github.com/gagoar/use-herald-action/actions">
      <img src="https://github.com/gagoar/use-herald-action/workflows/validation/badge.svg" alt="Workflow" />
    </a>
    <a href="https://codecov.io/gh/gagoar/use-herald-action">
      <img src="https://codecov.io/gh/gagoar/use-herald-action/branch/master/graph/badge.svg?token=48gHuQl8zV" alt="codecov" />
    </a>
    <a href="https://github.com/gagoar/alohomora/blob/master/LICENSE">
      <img src="https://img.shields.io/npm/l/alohomora.svg?style=flat-square" alt="MIT license" />
    </a>
</p>

# Use Herald Action.

This action allows you to add comments, reviewers and assignees to a pull request depending on rules you define!

## Table of contents

- [What is use-herald-action](#what-is-use-herald-action)
- [How to create rules](#how)
- [How To Create Rules](#input-parameters)
  - [Examples](#rule-examples)
- [Input parameters](#input-parameters)
- [Output](#output)
- [Examples](#examples)
  - [Basic example](#basic-example)
  - [Using output](#using-output)
  - [Specifying alias/version](#specifying-aliasversion)
  - [Handling logs](#handling-logs)

<hr>

## What is use-herald-action

This action allows you to write rules which run automatically when you create a pull request. For instance, you might want to get notified every time someone sends out a revision that affects some file you're interested in, even if they didn't add you as a reviewer or you are not a [CODEOWNERS](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners).

One way to think about `use-herald-action` is that it is a lot like the mail rules you can set up in most email clients to organize mail based on "To", "Subject", etc. This action works very similarly, but operates on pull requests changes instead of emails.

For example, you can write a personal rule like this which triggers on tasks:

When all of these conditions are met: { `pull_request` `title` contains `node`} and { files matching `*.ts` are changed } Take these actions: `notify me`.

For attaching reviewers github offers [CODEOWNERS](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners), but for [ assigning ](https://docs.github.com/en/github/managing-your-work-on-github/assigning-issues-and-pull-requests-to-other-github-users) or just notifying users about changes in certain files is something missing.

<hr>

## How to create a rule

Every rule can be written in a json file. with the following fields:

| Key             |    Type    | Required | Description                                                                                                                                                                                      |
| --------------- | :--------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`          |  `string`  |    No    | Friendly name to recognize the rule, if name is not provided, the filename will be used                                                                                                          |
| `action`        |  `string`  |   Yes    | The available actions are `comment` `review` `assign`                                                                                                                                            |
| `users`         | `string[]` |    No    | Github users (or emails of the users) that the rule will take action on                                                                                                                          |
| `teams`         | `string[]` |    No    | Github teams that the rule will take action on                                                                                                                                                   |
| `includes`      |  `string`  |    No    | Glob pattern that will be used to compare with the changed files in the pull request                                                                                                             |
| `excludes`      |  `string`  |    No    | Glob pattern that will remove occurrences found after `includes` has filtered the changed files (only used when `includes` is present)                                                           |
| `eventJsonPath` |  `string`  |    No    | [JsonPath expression](https://goessner.net/articles/JsonPath/) that will allow filtering content in the [pull request event](https://developer.github.com/webhooks/event-payloads/#pull_request) |
| `customMessage` |  `string`  |    No    | Message added as a comment when the rule is applied. (only used when action = `comment`)                                                                                                         |

## Rule Examples

### Notify users @eeny, @meeny, @miny and @moe when all files matching the glob `*.ts` are changed

```typescript
{
  "users": ["@eeny", "@meeny", "@miny", "@moe"],
  "action": "comment",
  "includes": "*.ts"
}
```

### Notify team @myTeam when files matching `directory/*.js` are changed and also exclude the file `directory/notThisFile.js`

```typescript
{
  "teams": ["@myTeam"],
  "action": "comment",
  "includes": "directory/*.ts",
  "excludes": "directory/notThisFile.js"
}
```

### Assign team @QATeam when files matching `integration/*.js` are changed and the title of the pull request includes QA

```typescript
{
  "teams": ["@QATeam"],
  "action": "assign",
  "includes": "integration/*.ts",
  "eventJSONPath": '$[?(@.title =~ /QA/)].title'
}
```

## Input parameters

| Key             |   Type    | Required | Description                                                                                                                                                                                                                    |
| --------------- | :-------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GITHUB_TOKEN`  | `string`  |   Yes    | [GITHUB_TOKEN](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#using-the-github_token-in-a-workflow) necessary for assign reviewers, assignees or comment on the PR |
| `rulesLocation` | `string`  |   Yes    | Directory where the rules can be found                                                                                                                                                                                         |
| `base`          | `string`  |    No    | Base can be fixed to always compare changes with a given tag/branch or master (more info on [base](https://docs.github.com/en/github/committing-changes-to-your-project/comparing-commits))                                    |
| `dryRun`        | `boolean` |    No    | Evaluate the rules but not perform the actions. the output will be available, [ check output for more details ](#output)                                                                                                       |

<hr>

## Output

This step will store the appliedRules from the action in `outputs.appliedRules`, inside you will find the matching rules, grouped by action (`comment | assign | review`)

Note that you will have to parse the output using the `fromJSON` [function](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#functions) before accessing individual properties.
See the [Using Output](#Using-Output) example for more details.

<hr>

## Examples

### Basic example

This step invokes a Lambda function without regard for the invocation output:

```yaml
- name: Invoke foobarFunction Lambda
  uses: gagoar/use-herald-action@master
  with:
    GITHUB_ACTION: ${{ secrets.GITHUB_ACTION }}
    rulesLocation: 'rules/*.json'
    dryRun: true
```

### Using output

These steps process the response payload by using step outputs:

```yaml
- name: Invoke foobarFunction Lambda
  uses: gagoar/use-herald-action@master
  id: foobar
  with:
    GITHUB_ACTION: ${{ secrets.GITHUB_ACTION }}
    rulesLocation: 'rules/*.json'
    dryRun: true
- name: Store response payload to file
  run: echo '\${{ fromJSON(steps.foobar.outputs.appliedRules) }}' > rulesApplied.json
```

Notice the addition of the `id` field to the invocation step.
For more information for Github Actions outputs, see their [reference](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjobs_idoutputs).
