// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

import {parseScrepResult} from './parse.ts'
import type {ScrepData} from '../types.ts'
import {runCommand, assertFileExists, type CommandResult} from './exec.ts'
import {validateOptions, resolveOptions, getOptionArg} from './options.ts'
import type {ScrepOptions, ScrepOptionName, SpawnOptions} from './options.ts'
import {parseVersionObject} from './version.ts'
import type {ScrepVersion} from './version.ts'

// Result returned after running the screp command line tool.
export interface ScrepResult {
  resultData: ScrepData | null
  options: ScrepOptions
  exitCode: number | null
  parseErrors: string | null
  hasValidResult: boolean
  abortSignal: string | null
}

/**
 * Returns the value of an argument passed on the command line.
 */
function getArgumentValue(optionName: ScrepOptionName, optionValue: boolean | string | null, options: ScrepOptions): string | null {
  if (optionName === 'mapDataHashAlgorithm') {
    return null
  }
  if (optionName === 'includeMapDataHash') {
    if (optionValue === false) {
      return null
    }
    if (options.mapDataHashAlgorithm == null) {
      throw new Error('If includeMapDataHash is set, a mapDataHashAlgorithm must be set as well')
    }
    return options.mapDataHashAlgorithm
  }
  return String(Boolean(optionValue))
}

/**
 * Returns an array of command line arguments we can pass to screp.
 */
function getCommandArguments(options: ScrepOptions, isBuffer: boolean): string[] {
  const args: string[] = []
  for (const [option, value] of Object.entries(options)) {
    const mappedArg = getOptionArg(option)
    if (mappedArg === null) {
      continue
    }
    const argValue = getArgumentValue(option as ScrepOptionName, value, options)
    if (argValue === null) {
      continue
    }
    args.push(`${mappedArg}=${argValue}`)
  }
  if (isBuffer) {
    args.push(`stdin`)
  }
  return args.map(arg => `-${arg}`)
}

/**
 * Parses the result of running the screp command and returns it as a result object.
 */
function wrapScrepResult(result: CommandResult, options: ScrepOptions): ScrepResult {
  const {stdout, exitCode, abortSignal} = result
  const abortSignalString = abortSignal ? String(abortSignal) : null
  const [resultData, parseErrors] = parseScrepResult(stdout)
  return {
    resultData,
    options,
    exitCode,
    parseErrors,
    hasValidResult: resultData != null && exitCode === 0,
    abortSignal: abortSignalString,
  }
}

/**
 * Returns arguments to pass to runCommand(), either with a file path or buffer.
 */
function getFileOrBufferArgs(cmd: string, args: string[], file: string | Buffer): [string[], Buffer | undefined] {
  const isBuffer = file instanceof Buffer
  if (isBuffer) {
    return [[cmd, ...args], file]
  }
  return [[cmd, ...args, file as string], undefined]
}

/**
 * Constructs a screp command, spawns a child process, and parses the result.
 * 
 * This is essentially equivalent to running screp on the command line; the output is parsed as JSON and typed.
 * 
 * Throws an error if the command could not be executed (for example, if screp is not installed).
 */
export async function runScrep(file: string | Buffer, screpOptions: ScrepOptions = {}, spawnOptions: SpawnOptions = {}): Promise<ScrepResult> {
  const isBuffer = file instanceof Buffer
  const options = resolveOptions(validateOptions(screpOptions))
  const args = getCommandArguments(options, isBuffer)
  const cmd = spawnOptions.screpPath ?? 'screp'
  if (!isBuffer) {
    await assertFileExists(file as string)
  }
  
  const result = await runCommand(...getFileOrBufferArgs(cmd, args, file))
  return wrapScrepResult(result, options)
}

/**
 * Runs "screp -version" and parses the result.
 * 
 * If the version cannot be parsed, null is returned.
 */
export async function getScrepVersion(spawnOptions: SpawnOptions = {}): Promise<ScrepVersion | null> {
  const cmd = spawnOptions.screpPath ?? 'screp'
  try {
    const result = await runCommand([cmd, '-version'])
    return parseVersionObject(result.stdout)
  }
  catch {
    return null
  }
}
