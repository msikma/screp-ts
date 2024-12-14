// @dada78641/screp-ts <https://github.com/msikma/screp-ts>
// © MIT license

export type BwGameSpeedName = 'Slowest' | 'Slower' | 'Slow' | 'Normal' | 'Fast' | 'Faster' | 'Fastest'
export type BwGameTypeName = 'None' | 'Custom' | 'Melee' | 'Free For All' | 'One on One' | 'Capture The Flag' | 'Greed' | 'Slaughter' | 'Sudden Death' | 'Ladder' | 'Use map settings' | 'Team Melee' | 'Team Free For All' | 'Team Capture The Flag' | 'Unknown' | 'Top vs Bottom' | 'Iron Man Ladder'
export type BwGameTypeShortName = 'None' | 'Custom' | 'Melee' | 'FFA' | '1on1' | 'CTF' | 'Greed' | 'Slaughter' | 'Sudden Death' | 'Ladder' | 'UMS' | 'Team Melee' | 'Team FFA' | 'Team CTF' | 'Unk' | 'TvB' | 'Iron Man Ladder'
export type BwPlayerTypeName = 'Inactive' | 'Computer' | 'Human' | 'Rescue Passive' | '(Unused)' | 'Computer Controlled' | 'Open' | 'Neutral' | 'Closed'
export type BwRaceTypeName = 'Zerg' | 'Terran' | 'Protoss'
export type BwRaceTypeShortName = 'zerg' | 'ran' | 'toss'
export type BwRaceTypeLetter = 90 | 84 | 80
export type BwColorName = 'Red' | 'Blue' | 'Teal' | 'Purple' | 'Orange' | 'Brown' | 'White' | 'Yellow' | 'Green' | 'Pale Yellow' | 'Tan' | 'Aqua' | 'Pale Green' | 'Blueish Grey' | 'Pale Yellow2' | 'Cyan' | 'Pink' | 'Olive' | 'Lime' | 'Navy' | 'Dark Aqua' | 'Magenta' | 'Grey' | 'Black'
export type BwTileSetName = 'Badlands' | 'Space Platform' | 'Installation' | 'Ashworld' | 'Jungle' | 'Desert' | 'Arctic' | 'Twilight'
export type BwLeaveGameReasonName = 'Quit' | 'Defeat' | 'Victory' | 'Finished' | 'Draw' | 'Dropped'

export interface ScrepHeader {
  Engine: {
    ID: number
    Name: string
    ShortName: string
  }
  Version: string
  Frames: number
  StartTime: string
  Title: string
  MapWidth: number
  MapHeight: number
  AvailSlotsCount: number
  Speed: {
    ID: number
    Name: BwGameSpeedName
  }
  Type: {
    ID: number
    Name: BwGameTypeName
    ShortName: BwGameTypeShortName
  }
  SubType: number
  Host: string
  Map: string
  Players: {
    ID: number
    SlotID: number
    Type: {
      ID: number
      Name: BwPlayerTypeName
    }
    Race: {
      ID: number
      Name: BwRaceTypeName
      ShortName: BwRaceTypeShortName
      Letter: BwRaceTypeLetter
    }
    Team: number
    Name: string
    Color: {
      ID: number
      Name: BwColorName
      RGB: number
    }
    Observer: boolean
  }[]
}

export interface ScrepCommands {
  Cmds: {
    Frame: number
    PlayerID: number
    Type: {
      ID: number
      Name: string
    }
    UnitTags?: number[]
    Pos?: {
      X: number
      Y: number
    }
    UnitTag?: number
    Unit?: {
      ID: number
      Name: string
    }
    Queued?: boolean
    IneffKind?: number
    HotkeyType?: {
      ID: number
      Name: string
    }
    Group?: number
    Order?: {
      ID: number
      Name: string
    }
    Upgrade?: {
      ID: number
      Name: string
    }
    SenderSlotID?: number
    Message?: string
    Reason?: {
      ID: number
      Name: string
    }
  }[],
  ParseErrCmds: null
}

export interface ScrepMapData {
  Name: string
  Version: number
  Description: string
  TileSet: {
    ID: number
    Name: BwTileSetName
  }
  PlayerOwners: {
    ID: number
    Name: string
  }[]
  PlayerSides: {
    ID: number
    Name: string
  }[]
  Tiles: number[] | null
  MineralFields: {
    X: number
    Y: number
    Amount: number
  }[] | null
  Geysers: {
    X: number
    Y: number
    Amount: number
  }[] | null
  StartLocations: {
    X: number
    Y: number
    SlotID: number
  }[]
  MapGraphics: {
    PlacedUnits: {
      X: number
      Y: number
      UnitID: number
      SlotID: number
      ResourceAmount?: number
      Sprite?: boolean
    }[] | null
    Sprites: {
      X: number
      Y: number
      SpriteID: number
    }[] | null
  } | null
}

export interface ScrepComputed {
  LeaveGameCmds: {
    Frame: number
    PlayerID: number
    Type: {
      ID: number
      Name: string
    }
    Reason: {
      ID: number
      Name: BwLeaveGameReasonName
    }
  }[]
  ChatCmds: {
    Frame: number
    PlayerID: number
    Type: {
      ID: number
      Name: string
    }
    SenderSlotID: number
    Message: string
  }[]
  WinnerTeam: number
  RepSaverPlayerID: number
  PlayerDescs: {
    PlayerID: number
    LastCmdFrame: number
    CmdCount: number
    APM: number
    EffectiveCmdCount: number
    EAPM: number
    StartLocation: {
      X: number
      Y: number
    }
    StartDirection: number
  }[]
}

export interface ScrepCustom {
  MapDataHash: string
}

export interface ScrepShieldBattery {
  StarCraftExeBuild: number
  ShieldBatteryVersion: string
  GameID: string
}

export interface ScrepData {
  Header: ScrepHeader | null
  Commands: ScrepCommands | null
  MapData: ScrepMapData | null
  Computed: ScrepComputed | null
  Custom?: ScrepCustom
  ShieldBattery?: ScrepShieldBattery
}

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
