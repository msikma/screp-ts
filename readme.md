[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fscrep-ts.svg)](https://badge.fury.io/js/@dada78641%2Fscrep-ts)

# @dada78641/screp-ts

Library that wraps the [icza/screp](https://github.com/icza/screp) command line tool for use in TypeScript.

This library depends on the `screp` command line tool being available on the system. It must be installed separately.

## Usage

To parse a replay file:

```ts
import {runScrep} from '@dada78641/screp-ts'

const res = await runScrep('./replay_file.rep')
```

The parsed data will be in `res.resultData`. A bit of metadata is available in the result as well.

You can pass an options object as the second argument:

| Option | Value | Equivalent | Description |
|:-------|:-------|:-------|:-------|
| includeCommands | boolean | `-cmds=true` | Includes in-game commands. |
| includeComputedData | boolean | `-computed=true` | Includes computed data. |
| includeReplayHeader | boolean | `-header=true` | Includes replay metadata information. |
| includeMapData | boolean | `-map=true` | Includes map data. Required for the other map options. |
| includeMapDataHash | boolean | `-mapDataHash=` *value* | Calculates a hash of the map data. Requires mapDataHashAlgorithm. |
| includeMapGraphics | boolean | `-mapgfx=true` | Includes map graphics. |
| includeMapResourceLocations | boolean | `-mapres=true` | Includes resource locations. |
| includeMapTiles | boolean | `-maptiles=true` | Includes map tile data. |
| mapDataHashAlgorithm | string† | – | Selects the algorithm for creating the map data hash. |

†: type **MapDataHashAlgorithm**, or `'sha1' | 'sha256' | 'sha512' | 'md5'`. If **includeMapDataHash** is true, this must be set.

### Types

This library includes type information for the parsed JSON output, among types for the library itself. The parsed JSON type can be imported as type `ScrepData`.

See [parse.ts](src/lib/parse.ts) for an overview.

## License

MIT licensed.
