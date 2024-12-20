import * as core from '@actions/core'
import { wait } from './wait.js'
import { createAppAuth } from '@octokit/auth-app'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())

    const baseUrl = process.env.GITHUB_API_URL
    const githubAppId: string = process.env.GITHUB_APP_ID ?? ''
    const privateKey = process.env.GITHUB_PRIVATE_KEY
    const installationId = process.env.GITHUB_INSTALLATION_ID

    const auth = createAppAuth({
      appId: githubAppId,
      privateKey: privateKey ?? '',
      installationId,
      baseUrl
    })

    // Retrieve installation access token
    const installationAuthentication = await auth({
      type: 'installation',
      installationId
    })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
