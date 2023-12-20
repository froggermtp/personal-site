module.exports = {
    env: process.env.ELEVENTY_ENV,
    timestamp: new Date(),
    gitRefName: process.env.GITHUB_REF_NAME,
    gitSha: process.env.GITHUB_SHA,
    workflowRunID: process.env.GITHUB_RUN_ID,
    workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT,
    workflowRunNumber: process.env.GITHUB_RUN_NUMBER,
    workflowURL: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
}