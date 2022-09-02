#!/usr/bin/env node

"use-strict";

const inquirer = require("inquirer");
const { Octokit } = require("@octokit/core");

async function deleteUserStarred(githubPersonalAccessToken) {
  try {
    const octokit = new Octokit({ auth: githubPersonalAccessToken });
    const { data } = await octokit.request(`GET /user/starred`);
    if (Array.isArray(data) && data.length !== 0) {
      data.forEach(async (item) => {
        console.log("Unstarring " + item.owner.login + "/" + item.name + " repository....");
        await octokit.request("DELETE /user/starred/{owner}/{repo}", {
          owner: item.owner.login,
          repo: item.name,
        });
      });
      return true;
    }
    console.log("You don’t have any starred repositories.")
    return false;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function runDeleteUserStarred(githubPersonalAccessToken) {
  let ran = await deleteUserStarred(githubPersonalAccessToken);
  while (ran) {
    if (!ran) return;
    ran = await deleteUserStarred(githubPersonalAccessToken);
  }
}

inquirer
  .prompt([
    {
      type: "input",
      name: "githubPersonalAccessToken",
      message: "Enter GitHub Personal Access Token:",
      default: "${GITHUB_PERSONAL_ACCESS_TOKEN_REPO_SCOPE}",
    },
  ])
  .then(function ({ githubPersonalAccessToken }) {
    runDeleteUserStarred(githubPersonalAccessToken);
  })
  .catch(function (error) {
    if (error.isTtyError) console.error(error.isTtyError, error);
    console.error(error);
  });
