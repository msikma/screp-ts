// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

import type {ScrepData} from '../types.ts'

/**
 * Removes debugging lines from the screp stdout text.
 * 
 * When an error occurs, screp prints the error to stdout instead of stderr.
 * Search for the first line starting with { and return everything from there.
 */
function trimDebuggingLines(screpStdout: string): string {
  if (screpStdout[0] === '{') {
    return screpStdout
  }
  const lines = screpStdout.split('\n')
  const firstLine = lines.findIndex(line => line[0] === '{')
  return lines.slice(firstLine).join('\n')
}

/**
 * Attempts to parse the result of the screp command, and returns it as a ScrepData object if successful.
 */
export function parseScrepResult(stdout: string): [ScrepData | null, boolean | null] {
  if (stdout == null || stdout.trim() === '') {
    return [null, null]
  }
  try {
    const trimmedStdout = trimDebuggingLines(stdout)
    const obj = JSON.parse(trimmedStdout)
    return [obj as ScrepData, stdout !== trimmedStdout]
  }
  catch {
    return [null, null]
  }
}
