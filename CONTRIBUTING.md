# Contributing to ng-alain-gighub

We would love for you to contribute to ng-alain-gighub and help make it even better than it is
today! As a contributor, here are the guidelines we would like you to follow:

 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Maintainer Responsibilities](#maintainers)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)

## <a name="issue"></a> Found a Bug?
If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?
You can *request* a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a  for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs we will systematically ask you to provide a minimal reproduction scenario using http://plnkr.co. Having a live, reproducible scenario gives us wealth of important information without going back & forth to you with additional questions like:

- version of ng-alain used
- 3rd-party libraries and their versions
- and most importantly - a use-case that fails

A minimal reproduce scenario using http://plnkr.co/ allows us to quickly confirm a bug (or point out coding problem) as well as confirm that we are fixing the right problem. If plunker is not a suitable way to demonstrate the problem (for example for issues related to our npm packaging), please create a standalone git repository demonstrating the problem.

We will be insisting on a minimal reproduce scenario in order to save maintainers time and ultimately be able to fix more bugs. Interestingly, from our experience users often find coding problems themselves while preparing a minimal plunk. We understand that sometimes it might be hard to extract essentials bits of code from a larger code-base but we really need to isolate the problem before we can fix it.

Unfortunately we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you we are going to close an issue that don't have enough info to be reproduced.

You can file new issues by filling out our [new issue form](https://github.com/ng-alain/ng-alain-gighub/issues/new).


### <a name="submit-pr"></a> Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

* Search [GitHub](https://github.com/ng-alain/ng-alain-gighub/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

  ```shell
  git checkout -b my-fix-branch master
  ```

* Create your patch, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Run the full ng-alain test suite <!-- , as described in the [developer documentation][dev-doc] -->, and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit). Adherence to these conventions
  is necessary because release notes are automatically generated from these messages.

  ```shell
  git commit -a
  ```

  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

  ```shell
  git push origin my-fix-branch
  ```

* In GitHub, send a pull request to `ng-alain:master`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the ng-alain test suites to ensure tests are still passing.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

  ```shell
  git rebase master -i
  git push -f
  ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

* Check out the master branch:

  ```shell
  git checkout master -f
  ```

* Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

* Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```

## <a name="maintainers"></a> Maintainer Responsibilities

This section outlines the ownership and responsibilities for different parts of the repository. When contributing, please tag the relevant maintainers for review.

### Repository Structure Ownership

**根目錄/ (Root Directory)**  
倉庫總負責人：@repo-maintainer  
負責版本策略、發行與授權（MIT）。

**README.md, docs/**  
文件維護：@doc-team  
負責教學、快速啟動與中文/英文同步。

**src/**  
前端應用程式維護：@frontend-team  
負責所有 Angular/ng-alain 相關程式碼與介面變更。

**src/app/routes/**  
應用功能模組所有者（按模組細分）：
- `src/app/routes/accounts/` → @auth-owner
- `src/app/routes/blueprints/` → @blueprint-owner
- `src/app/routes/tasks/` → @task-owner
- `src/app/routes/issues/` → @issue-owner
- `src/app/routes/quality/` → @quality-owner
- `src/app/routes/documents/` → @document-owner
- `src/app/routes/analytics/` → @analytics-owner
- `src/app/routes/collaboration/` → @collaboration-owner
- `src/app/routes/communication/` → @communication-owner
- `src/app/routes/bots/` → @bot-owner
- `src/app/routes/dashboard/` → @dashboard-owner
- `src/app/routes/system/` → @system-owner
- 其他模組請參考實際目錄結構

**src/app/shared/**  
共用模組維護：@shared-owner  
負責共用元件、服務、工具函數與 SHARED_IMPORTS。

**src/app/core/**  
核心模組維護：@core-owner  
負責基礎設施、HTTP 攔截器、路由守衛、國際化服務。

**src/app/layout/**  
佈局模組維護：@layout-owner  
負責整體佈局、導航、側邊欄、主題切換。

**_mock/**  
假資料與測試資料：@qa-team  
負責同步 mock 與 API contract。

**e2e/**  
e2e 測試：@qa-team  
負責覆蓋率與 CI e2e 流程。

**scripts/**  
開發/部署腳本：@devops  
負責 CI/CD 腳本與自動化工具。

**.github/, CONTRIBUTING.md, ISSUE_TEMPLATE.md, PULL_REQUEST_TEMPLATE.md**  
社群貢獻與流程：@maintainers  
負責 PR 流程與審核政策。

**public/**  
靜態資源（favicon、manifest）：@frontend-team  
負責資源變更與版本管理。

**package.json, yarn.lock, repomix.config.json 等配置檔**  
相依與發行管理：@release-engineer  
負責相依更新、發佈與 breaking change 註記。

**docs/*.md（像 BUILD_ERRORS.md, AGENTS.md）**  
專門文件作者：@tech-writer  
負責內容準確性與範例。

**.vscode, .husky**  
開發環境與 pre-commit hooks：@developer-experience  
負責開發者體驗設定。

### Contacting Maintainers

When submitting PRs or issues, please:
1. Tag the relevant maintainer(s) based on the affected area
2. Wait for maintainer review before merging
3. For cross-module changes, tag all affected maintainers

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).
* All public API methods **must be documented**.

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the ng-alain change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/ng-alain/ng-alain-gighub/commits/master))

```
docs(changelog): update change log to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[github]: https://github.com/ng-alain/ng-alain-gighub
[plunker]: http://plnkr.co/edit
