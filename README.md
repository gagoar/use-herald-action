<p align="center">
    <a href="https://github.com/marketplace/actions/use-herald-action">
      <img src="https://img.shields.io/badge/Marketplace-v2-undefined.svg?logo=github&logoColor=white&style=flat" alt="GitHub Marketplace" />
    </a>
    <a href="https://github.com/gagoar/use-herald-action/actions">
      <img src="https://github.com/gagoar/use-herald-action/workflows/validation%20on%20Master/badge.svg" alt="Workflow" />
    </a>
    <a href="https://codecov.io/gh/gagoar/use-herald-action">
      <img src="https://codecov.io/gh/gagoar/use-herald-action/branch/master/graph/badge.svg?token=48gHuQl8zV" alt="codecov" />
    </a>
    <a href="https://github.com/gagoar/alohomora/blob/master/LICENSE">
      <img src="https://img.shields.io/npm/l/alohomora.svg?style=flat-square" alt="MIT license" />
    </a>
</p>
<p align="center">
  <a href="https://github.com/gagoar/use-herald-action">
    <img src="images/logo.png" alt="Logo" width="128" height="128">
  </a>

  </p>

# Use Herald Action

This action allows you to add comments, reviewers and assignees to a pull request depending on rules you define!

## Table of contents

- [What is `use-herald-action`?](#what-is-use-herald-action)
  - [Motivation](#motivation)
- [Additional setup](#additional-setup)
  - [Context](#context)
- [How to create a rule](#how-to-create-a-rule)
- [Rule Examples](#rule-examples)
- [Error levels](#error-levels)
- [Input parameters](#input-parameters)
- [Output](#output)
- [Events](#events)
- [Examples](#examples)
  - [Basic example](#basic-example)
  - [Using output](#using-output)

<hr>

## What is `use-herald-action`?

Given a set of rules defined in a JSON document, this action will execute actions based on those rules.

A **rule** is a way of defining an action that is to be performed once a certain set of conditions is met.
For example, you might want to get notified every time somebody opens a pull request that affects some file you're interested in, even if they didn't add you as a reviewer and you are not a [codeowner](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners).

Working with a more concrete example, we have the power to create a rule that:

- Has conditions:
  - { `pull_request` `title` contains `node`}
  - { files matching `*.ts` are changed }
- If all conditions met, will take the action:
  - `notify me`

One way to think about these rules is to compare it to mail filters ([Gmail filters](https://support.google.com/mail/answer/6579)) that will, for example, apply labels to incoming mail if certain keywords are found in the subject or body.
In this context, we are dealing with pull requests instead of emails.

### Motivation

This action is particularly useful when you want to subscribe to changes made to certain files, much like the "Subscriber" concept used in [Phabricator](https://www.phacility.com/phabricator/).

For attaching reviewers, GitHub offers [CODEOWNERS](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners).
However, no equivalent exists for [assigning](https://docs.github.com/en/github/managing-your-work-on-github/assigning-issues-and-pull-requests-to-other-github-users) users.
Nor does there exist a method to automatically subscribe to said pull requests (without being a reviewer).

Although the main motivation behind this GitHub Action is to bridge the gap described above, this can be extended to many different use cases.

<hr>

## Additional setup

Are you looking to use `use-herald-action` in a **private organization's repository**? If so, you wil need to do some [additional setup here](https://gagoar.github.io/use-herald-action) prior to using the action in your workflow.

### Context

The secret `secrets.GITHUB_TOKEN` provided in a workflow does not have sufficient permissions to mention users and teams that belong to private organizations. This is a problem because `use-herald-action` will create a comment with mentions of private users and teams (prepended with an `@`), but Github will not notify the users because of the lack of permissions. To solve this, we generate a token _with_ sufficient permissions by installing a GitHub App in your private organization. For more information, see [this issue](https://github.com/gagoar/use-herald-action/issues/83).

<hr>

## How to create a rule

Every rule can be written in JSON with the following key-value pairs:

| Key               |          Type          | Required | Description                                                                                                                                                                                                                                              |
| ----------------- | :--------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            |        `string`        |    No    | Friendly name to recognize the rule; defaults to the rule filename                                                                                                                                                                                       |
| `description`     |        `string`        |    No    | Description for a rule; It will be used when `action` is set to `status` as the description for the [commit status](https://github.blog/2012-09-04-commit-status-api/)                                                                                   |
| `action`          |        `string`        |   Yes    | Currently, supported actions are `comment`, `review`, `assign` and `label`, `status`                                                                                                                                                                     |
| `includes`        | `string` \| `string[]` |    No    | Glob pattern/s used to match changed filenames in the pull request                                                                                                                                                                                       |
| `excludes`        | `string` \| `string[]` |    No    | Glob pattern/s used to exclude changed filenames (requires `includes` key to be provided)                                                                                                                                                                |
| `eventJsonPath`   | `string` \| `string[]` |    No    | [JsonPath expressions](https://goessner.net/articles/JsonPath/) used to filter information in the [pull request event](https://developer.github.com/webhooks/event-payloads/#pull_request). Rules will be evaluated in order as they appear in the array |
| `includesInPatch` | `string` \| `string[]` |    No    | Regex to match file content changes (ignored if malformed or invalid)                                                                                                                                                                                    |
| `customMessage`   |        `string`        |    No    | Message to be commented on the pull request when the rule is applied (requires `action === comment`)                                                                                                                                                     |
| `users`           |       `string[]`       |    No    | GitHub user handles (or emails) on which the rule will take action. It will not be used when `action` is set to `comment` and `customMessage` field is present                                                                                           |
| `teams`           |       `string[]`       |    No    | GitHub teams on which the rule will take action. It will not be used when `action` is set to `comment` and `customMessage` field is present                                                                                                              |
| `targetURL`       |        `string`        |    No    | When `action` set to `status`, link to which the [Details](https://github.blog/2012-09-04-commit-status-api/) link will point                                                                                                                            |
| `labels`          |       `string[]`       |    No    | Github labels which the rule will add. Only valid when `action` field is set to `label`                                                                                                                                                                  |
| `errorLevel`      |        `string`        |    No    | Currently, supported error levels are `none`, `error`, by default is set to `none`, you can read more [here](#error-levels)                                                                                                                              |

## Rule Examples

**Notify users @eeny, @meeny, @miny and @moe when all files matching `*.ts` are changed**

```json
{
  "users": ["eeny", "meeny", "miny", "moe"],
  "action": "comment",
  "includes": "*.ts"
}
```

**Notify team @myTeam when files matching `directory/*.js` are changed, excluding `directory/notThisFile.js`**

```json
{
  "teams": ["myTeam"],
  "action": "comment",
  "includes": "directory/*.ts",
  "excludes": "directory/notThisFile.js"
}
```

**Assign team @QATeam when files matching `integration/*.js` are changed and the title of the pull request includes QA**

```json
{
  "teams": ["QATeam"],
  "action": "assign",
  "includes": "integration/*.ts",
  "eventJSONPath": "$..[?(@.title.match("QA"))]"
}
```

## Error levels

When creating rules, you can use the `errorLevel` to change how `use-herald-action` will report back when the rule has no matches. This could be useful to make sure a rule is always matching. For example, when trying to validate that a pull request template is respected.

**Add friendly message when a PR is opened, but if is not applied, fail the workflow**

```json
{
  "action": "comment",
  "customMessage": "Thanks for opening a pull request, looks like all is good! Please wait till the checks are all green to merge ",
  "eventJSONPath": "$..[?(@.body.match("Issue Ticket:"))]",
  "errorLevel": "error"
}
```

## Input parameters

| Key             |   Type    | Required | Description                                                                                                                                                                                                                      |
| --------------- | :-------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`  | `string`  |   Yes    | [GitHub token](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#using-the-github_token-in-a-workflow), necessary for adding reviewers, assignees or comments on the PR |
| `rulesLocation` | `string`  |   Yes    | Directory where the rules can be found                                                                                                                                                                                           |
| `base`          | `string`  |    No    | Fixed base - tag/branch against which to always compare changes (more info on [base](https://docs.github.com/en/github/committing-changes-to-your-project/comparing-commits)                                                     |
| `DEBUG`         | `string`  |    No    | Provide to enable verbose logging (ex: `DEBUG: "*"`)                                                                                                                                                                             |
| `dryRun`        | `boolean` |    No    | Evaluate rule conditions but do not execute actions - [see output for results](#output)                                                                                                                                          |

<hr>

## Output

This action will store the rules applied in `outputs.appliedRules`.
Here, you will find the matching rules, grouped by actions (`comment | assign | review`).

Note that you will have to parse the output using the [`fromJSON` function](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#functions) before accessing individual properties.
See the [Using Output](#Using-Output) example for more details.

<hr>

## Events

Use herald action can only be used on the following events:

- `pull_request`
- `pull_request_target`
- `push`

Any other event will produce an error in the workflow

## Examples

### Basic example

This step runs the action without regard for output:

```yaml
- name: Apply Herald rules
  uses: gagoar/use-herald-action@master
  with:
    GITHUB_ACTION: ${{ secrets.GITHUB_ACTION }}
    rulesLocation: 'rules/*.json'
    dryRun: true
```

### Using output

These steps stores the action's outputs into a JSON file:

```yaml
- name: Apply Herald rules
  uses: gagoar/use-herald-action@master
  id: foobar
  with:
    GITHUB_ACTION: ${{ secrets.GITHUB_ACTION }}
    rulesLocation: 'rules/*.json'
    dryRun: true
- name: Store applied rules to file
  run: echo '\${{ fromJSON(steps.foobar.outputs.appliedRules) }}' > rulesApplied.json
```

Notice the inclusion of the `id` field in the first step (`Invoke foobarFunction Lambda`). This is so that the second step (`Store response payload to file`) can reference the result of the first step.
For more information for Github Actions outputs, see their [reference](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjobs_idoutputs).
