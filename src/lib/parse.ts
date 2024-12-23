// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

import type {ScrepData} from '../types.ts'

/**
 * Removes debugging lines from the screp stdout text.
 * 
 * When an error occurs, screp prints the error to stdout instead of stderr.
 * Search for the first line starting with { and return everything from there.
 */
function splitDebuggingLines(stdout: string): [string, string] {
  if (stdout[0] === '{') {
    return [stdout, '']
  }
  const lines = stdout.split('\n')

  // The first valid line is the line opening the JSON object.
  const firstLine = lines.findIndex(line => line[0] === '{')

  return [
    // The JSON content.
    lines.slice(firstLine).join('\n'),
    // Debug lines (e.g. parsing errors).
    lines.slice(0, firstLine).join('\n'),
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
export function parseScrepResult(stdout: string): [ScrepData | null, string | null] {
  if (stdout == null || stdout.trim() === '') {
    return [null, null]
  }
  try {
    const [main, debug] = splitDebuggingLines(stdout)
    const obj = parseOutput(main)
    return [obj, debug.trim()]
  }
  catch {
    return [null, null]
  }
}
