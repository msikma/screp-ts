// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

export type ScrepVersion = {
  [Key in typeof versionKeys[number]]: string
}

// All known screp version keys.
const versionKeys = [
  'screp version',
  'Parser version',
  'EAPM algorithm version',
  'Platform',
  'Built with',
  'Author',
  'Home page'
] as const

/**
 * Returns whether a given key is a valid screp version key.
 */
function isVersionKey(key: string): key is typeof versionKeys[number] {
  return versionKeys.includes(key as typeof versionKeys[number])
}

/**
 * Parses the screp version string and returns it as object.
 * 
 * The screp version output is multiple lines of colon separated key/value pairs.
 */
export function parseVersionObject(_versionString: string | null): ScrepVersion | null {
  if (!_versionString) {
    return null
  }
  const versionString = _versionString.trim()
  const lines = versionString.split('\n')
  const version: Partial<ScrepVersion> = {}
  for (const line of lines) {
    const [key, value] = line.split(/: (.+)?/, 2)
    
    // If this is an unknown version string, skip it.
    // Up to v1.12.5 this should never happen, but later versions might change the version format.
    if (!isVersionKey(key)) {
      continue
    }
    
    (version as Record<string, string>)[key] = value
  }
  return version as ScrepVersion
}
