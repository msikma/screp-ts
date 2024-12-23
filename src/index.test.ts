// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

import {fileURLToPath} from 'node:url'
import * as path from 'node:path'
import * as fs from 'fs/promises'
import {describe, it, expect} from 'vitest'
import {runScrep, getScrepVersion, canRunScrep, isValidOptions} from './index.ts'

// By default, we expect screp to be on the path if you need to test and yours isn't, set spawn options here.
const TEST_SPAWN_OPTIONS = undefined

// Path to the test files directory.
const TEST_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'test')

// Files we're using for testing purposes.
const TEST_REP_LADDER = path.join(TEST_DIR, '241215_185024_ladder.rep')
const TEST_REP_BUGGY = path.join(TEST_DIR, '230727_190506_buggy.rep')
const TEST_REP_INVALID = path.join(TEST_DIR, 'not_a_replay.rep')

describe('screp-ts', () => {
  describe('runScrep', () => {
    it('should return the wrapped screp result', async () => {
      const res = await runScrep(TEST_REP_LADDER, undefined, TEST_SPAWN_OPTIONS)
      expect(res).toEqual(expect.objectContaining({
        resultData: expect.any(Object),
        options: expect.any(Object),
        exitCode: expect.any(Number),
        parseErrors: '',
        hasValidResult: true,
        abortSignal: null,
      }))
    })
  
    it('should throw an error when the file does not exist', async () => {
      await expect(runScrep(path.join(TEST_DIR, '_nonexistent_file_.rep'), undefined, TEST_SPAWN_OPTIONS)).rejects.toThrow(/ENOENT/)
    })
  
    it('should return a parse error for invalid replays', async () => {
      const res = await runScrep(TEST_REP_INVALID, undefined, TEST_SPAWN_OPTIONS)
      expect(res).toEqual(expect.objectContaining({
        resultData: null,
        options: expect.any(Object),
        exitCode: 2,
        parseErrors: 'Failed to parse replay: Decoder.Section() error: not a replay file',
        hasValidResult: false,
        abortSignal: null,
      }))
    })
  
    it('should include parse errors for valid but buggy replays', async () => {
      const res = await runScrep(TEST_REP_BUGGY, undefined, TEST_SPAWN_OPTIONS)
      expect(res).toEqual(expect.objectContaining({
        resultData: expect.any(Object),
        options: expect.any(Object),
        exitCode: 0,
        parseErrors: expect.stringContaining('skipping typeID'),
        hasValidResult: true,
        abortSignal: null,
      }))
    })
  
    it('should accept a buffer as argument', async () => {
      const buffer = await fs.readFile(TEST_REP_LADDER)
      const res = await runScrep(buffer, undefined, TEST_SPAWN_OPTIONS)
      expect(res).toEqual(expect.objectContaining({
        resultData: expect.any(Object),
        options: expect.any(Object),
        exitCode: expect.any(Number),
        parseErrors: '',
        hasValidResult: true,
        abortSignal: null,
      }))
    })
  })
  
  describe('canRunScrep', () => {
    it('should return true when the screp command exists', async () => {
      expect(await canRunScrep('screp')).toBe(true)
    })
  
    it('should return false when the screp command does not exist', async () => {
      expect(await canRunScrep('non_existent_screp_path')).toBe(false)
    })
  })

  describe('getScrepVersion', () => {
    it('should return the parsed version when the command runs successfully', async () => {
      const res = await getScrepVersion(TEST_SPAWN_OPTIONS)
      expect(res).toEqual(expect.objectContaining({
        'screp version': expect.any(String),
        'Parser version': expect.any(String),
        'EAPM algorithm version': expect.any(String),
        'Platform': expect.any(String),
        'Built with': expect.any(String),
        'Author': expect.any(String),
        'Home page': expect.any(String),
      }))
    })
  
    it('should return null when the command fails', async () => {
      const res = await getScrepVersion({screpPath: 'non_existent_screp_path'})
      expect(res).toEqual(null)
    })
  })

  describe('isValidOptions', () => {
    it('should return true for valid options', () => {
      const opts1 = isValidOptions({})
      const opts2 = isValidOptions({
        includeMapData: true,
      })
      const opts3 = isValidOptions({
        includeReplayHeader: false,
      })
  
      for (const opt of [opts1, opts2, opts3]) {
        expect(opt).toBe(true)
      }
    })
  
    it('should return false for invalid options', () => {
      const opts1 = isValidOptions(null)
      const opts2 = isValidOptions({
        somethingInvalid: true,
      })
      const opts3 = isValidOptions({
        includeCommands: 'string',
      })
  
      for (const opt of [opts1, opts2, opts3]) {
        expect(opt).toBe(false)
      }
    })
  })
})
