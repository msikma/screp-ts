// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

import type {ScrepData} from '../types.ts'

/**
 * Attempts to parse the result of the screp command, and returns it as a ScrepData object if successful.
 */
export function parseScrepResult(stdout: string): ScrepData | null {
  if (stdout == null || stdout.trim() === '') {
    return null
  }
  try {
    const obj = JSON.parse(stdout)
    return obj as ScrepData
  }
  catch {
    return null
  }
}
