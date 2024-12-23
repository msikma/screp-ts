[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fscrep-ts.svg)](https://badge.fury.io/js/@dada78641%2Fscrep-ts) [![screp v1.12.10](https://img.shields.io/badge/screp-v1.12.10-orange)](https://www.npmjs.com/package/screp-js)

# @dada78641/screp-ts

Library that wraps the [icza/screp](https://github.com/icza/screp) command line tool for use in TypeScript and JavaScript.

Unlike [screp-js](https://www.npmjs.com/package/screp-js), which is a pure JS version of the tool, this library depends on the `screp` command line tool being available on the system. **It must be installed separately.**

I recommend using this library instead of screp-js, as running the native binary is *much* faster and this project includes types for the result data.

## Usage

As prerequisite, the **screp** command line tool must be installed. If it's on the `PATH`, you don't have to specify its location.

Get the source or a prebuilt binary at [icza/screp](https://github.com/icza/screp) to start using this library.

**Once screp is installed,** you can add this library as dependency via `@dada78641/screp-ts`, and start parsing files like this:

```ts
import {runScrep} from '@dada78641/screp-ts'

const res = await runScrep('./replay_file.rep')
```

The parsed data will be in `res.resultData`. Since we run screp as an external command, the result also includes some metadata about the command execution itself.

If the command was able to execute, it will always resolve with the result, even if the result is negative (such as an unparseable file). If the child process was terminated abnormally (e.g. terminated by the OS), the `runScrep()` command will throw an error.

### Options

You can pass an options object as the second argument. This narrows the data down to specific parts. Parsing speed is unchanged, but the size of the response will vary.

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

See [src/lib/parse.ts](src/lib/parse.ts) for an overview.

## External links

* [icza/screp](https://github.com/icza/screp), the original project
* [screp-js](https://www.npmjs.com/package/screp-js), a pure JS compiled version of screp

## License

MIT licensed.
