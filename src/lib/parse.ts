// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

import type {ScrepData} from '../types.ts'

/**
 * Removes error and debugging lines from the screp stdout text.
 * 
 * Errors can be printed both to stdout and stderr. This attempts to separate them both.
 * Future versions of screp may well change this behavior.
 */
function splitErrorLines(stdout: string, stderr: string): [string, string] {
  const lines = stdout.split('\n')

  // The first valid line is the line opening the JSON object.
  const firstLine = lines.findIndex(line => line[0] === '{')

  return [
    // The JSON content.
    lines.slice(firstLine).join('\n'),
    // Debug lines (e.g. parsing errors), plus anything printed to stderr.
    [lines.slice(0, firstLine).join('\n'), stderr].join('\n'),
  ]
}

/**
 * Parses the screp output and returns it as ScrepData, or null if the content isn't valid JSON.
 */
function parseOutput(stdout: string): ScrepData | null {
  try {
    const obj = JSON.parse(stdout)
    return obj as ScrepData
  }
  catch (err) {
    // Return null if this is a JSON parsing error.
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      return null
    }
    // Rethrow otherwise.
    throw err
  }
}

/**
 * Attempts to parse the result of the screp command, and returns it as a ScrepData object if successful.
 */
export function parseScrepResult(stdout: string, stderr: string): [ScrepData | null, string | null] {
  if (stdout == null || stdout.trim() === '') {
    return [null, null]
  }
  try {
    const [main, error] = splitErrorLines(stdout, stderr)
    const obj = parseOutput(main)
    return [obj, error.trim()]
  }
  catch {
    return [null, null]
  }
}
