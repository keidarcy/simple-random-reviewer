import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const context = github.context
    core.info(`context ${JSON.stringify(context)}!`)
    const octokit = github.getOctokit(token)
    const owner = context.payload.pull_request?.user.login
    const issue_number = context.payload.pull_request?.number

    if (!issue_number) {
      core.setFailed('issue_number is not defined')
      throw new Error('issue_number is not defined')
    }

    issue_number

    await octokit.rest.issues.addAssignees({
      ...context.repo,
      issue_number,
      assignees: [owner]
    })

    core.debug(new Date().toTimeString())
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
