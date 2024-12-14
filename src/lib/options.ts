// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

// Supported map data hash algorithms.
export type MapDataHashAlgorithm = 'sha1' | 'sha256' | 'sha512' | 'md5'

// Options accepted by the screp command line tool interface.
export interface ScrepOptions {
  includeCommands?: boolean
  includeComputedData?: boolean
  includeReplayHeader?: boolean
  includeMapData?: boolean
  includeMapDataHash?: boolean
  includeMapGraphics?: boolean
  includeMapResourceLocations?: boolean
  includeMapTiles?: boolean
  mapDataHashAlgorithm?: MapDataHashAlgorithm | null
}

// Names of valid option keys.
export type ScrepOptionName = keyof ScrepOptions

// Auxiliary options used to construct the command.
export interface SpawnOptions {
  screpPath?: string | null
}

// The default options (this reflects what happens when you run screp on a file without additional arguments).
const defaultOptions: ScrepOptions = {
  includeCommands: false,
  includeComputedData: true,
  includeReplayHeader: true,
  includeMapData: false,
  includeMapDataHash: false,
  includeMapGraphics: false,
  includeMapResourceLocations: false,
  includeMapTiles: false,
  mapDataHashAlgorithm: null,
}

// Maps interface options to command line arguments.
const optionArgs = new Map(Object.entries({
  includeCommands: 'cmds',
  includeComputedData: 'computed',
  includeReplayHeader: 'header',
  includeMapData: 'map',
  includeMapDataHash: 'mapDataHash',
  includeMapGraphics: 'mapgfx',
  includeMapResourceLocations: 'mapres',
  includeMapTiles: 'maptiles',
  mapDataHashAlgorithm: null,
}))

/**
 * Ensures that the given options are not going to cause an error.
 */
export function validateOptions(options: ScrepOptions): ScrepOptions {
  const {
    includeMapDataHash,
    mapDataHashAlgorithm,
    includeMapData,
    includeMapGraphics,
    includeMapResourceLocations,
    includeMapTiles
  } = options
  if (includeMapDataHash === true && mapDataHashAlgorithm == null) {
    throw new Error('If includeMapDataHash is true, a mapDataHashAlgorithm must be set as well')
  }
  if (mapDataHashAlgorithm != null && includeMapDataHash !== true) {
    throw new Error('If a mapDataHashAlgorithm is set, includeMapDataHash must be set to true')
  }
  if (includeMapData !== true) {
    if (includeMapGraphics === true) {
      throw new Error('If a includeMapGraphics is true, includeMapData must be set to true as well')
    }
    if (includeMapResourceLocations === true) {
      throw new Error('If a includeMapResourceLocations is true, includeMapData must be set to true as well')
    }
    if (includeMapTiles === true) {
      throw new Error('If a includeMapTiles is true, includeMapData must be set to true as well')
    }
  }
  return options
}

/**
 * Returns the equivalent command line argument for a given option.
 * 
 * If the passed option is unrecognized, this throws an error.
 * If the value is null, null is returned (in which case the argument should be ignored).
 * In regular cases, a valid screp command line argument name is returned as string.
 */
export function getOptionArg(optionName: string): string | null {
  const value = optionArgs.get(optionName)
  if (value === undefined) {
    throw new Error(`Unknown option passed: ${optionName}`)
  }
  if (value === null) {
    return null
  }
  return value
}

/**
 * Merges in the default options and returns the result.
 */
export function resolveOptions(userOptions: ScrepOptions): ScrepOptions {
  return {...defaultOptions, ...userOptions}
}

/**
 * Returns whether a given options object is valid.
 */
export function isValidOptions(options: ScrepOptions): boolean {
  try {
    validateOptions(options)
    return true
  }
  catch {
    return false
  }
}
