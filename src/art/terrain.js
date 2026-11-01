// =====================================================================
//  terrain.js – markplattor i 16x16, i anden av ett 16-bitars Zelda.
//  Varje platta har ett id. Id 0 används inte (tom ruta i tilemap).
//  Färgerna är en egen palett, skild från hjälten.
// =====================================================================

// Bokstav = färg. Används bara när plattorna ritas.
const C = {
  '.': null,
  K: 0x181820, // kontur
  g: 0x68b838, // ljus gräs
  G: 0x3c9820, // gräs
  d: 0x2a7018, // mörk gräs / skugga
  f: 0xe04848, // blomma röd
  w: 0xf0d048, // blomma gul
  a: 0x183878, // djupt vatten
  b: 0x3060c0, // vatten
  c: 0x88b0e8, // vattenblänk
  s: 0xf0d8a0, // sand
  S: 0xc8a868, // mörk sand
  p: 0xd0a868, // stig
  P: 0xa07840, // stigskugga
  r: 0xd0c8b0, // gatsten
  R: 0x989080, // fog
  n: 0xe8e0c8, // bro
  o: 0xa06830, // brygga
  O: 0x704018, // bryggskugga
  l: 0x606068, // räls
  i: 0x8c6840, // syll
  h: 0xd83838, // rött tak
  H: 0x901818, // takskugga
  u: 0xf4e4c4, // vägg
  U: 0xc8a878, // väggskugga
  e: 0x6c4018, // trä
  t: 0x30a030, // löv
  T: 0x146814, // mörka löv
  m: 0xb0a898, // berg
  M: 0x686058, // bergskugga
  q: 0xf0ece4, // snö/topp
  k: 0xc8c8d8, // slott/tempel
  y: 0xe8c040, // vete / fyrljus
  Y: 0xb08820,
  z: 0x4c7840, // träsk
  Z: 0x2c4838, // träskvatten
  W: 0xf8f8f8, // segel
  A: 0xf0c040, // guld
  B: 0x8c5830, // skrov
};

export const TILE = {
  GRASS: 1,
  GRASS_ALT: 2,
  FLOWERS: 3,
  FOREST: 4,
  TREE: 5,
  MOUNTAIN: 6,
  PEAK: 7,
  WATER: 8,
  WATER_DEEP: 9,
  SAND: 10,
  PATH: 11,
  ROAD: 12,
  BRIDGE: 13,
  DOCK: 14,
  RAIL: 15,
  ROOF_RED: 16,
  ROOF_BLUE: 17,
  WALL: 18,
  CASTLE: 19,
  SHOP: 20,
  CAVE: 21,
  DUNGEON: 22,
  RUINS: 23,
  FARM: 24,
  WHEAT: 25,
  WINDMILL: 26,
  SWAMP: 27,
  SWAMP_WATER: 28,
  PLAZA: 29,
  CHURCH: 30,
  STATION: 31,
  SHIP: 32,
  LIGHTHOUSE: 33,
  WAREHOUSE: 34,
  MINE: 35,
  GARDEN: 36,
  ROCK: 37,
  HUT: 38,
  FENCE: 39,
  SECRET: 40,
};

// Så många plattor som finns, inklusive det oanvända id 0.
export const TILE_COUNT = 41;

// Plattor hjälten inte kan gå igenom.
export const SOLID = new Set([
  TILE.TREE, TILE.MOUNTAIN, TILE.PEAK, TILE.WATER, TILE.WATER_DEEP,
  TILE.ROOF_RED, TILE.ROOF_BLUE, TILE.WALL, TILE.CASTLE, TILE.SHOP,
  TILE.RUINS, TILE.WINDMILL, TILE.SWAMP_WATER, TILE.CHURCH, TILE.STATION,
  TILE.SHIP, TILE.LIGHTHOUSE, TILE.WAREHOUSE, TILE.MINE, TILE.ROCK,
  TILE.HUT, TILE.FENCE,
]);

// Ungefärliga färger för översiktsbilden (en pixel per ruta).
export const TILE_COLOR = {
  1: 0x58b030,
  2: 0x48a028,
  3: 0x70c040,
  4: 0x2e7818,
  5: 0x1c6810,
  6: 0x8c8478,
  7: 0xd8d4cc,
  8: 0x3870d0,
  9: 0x204888,
  10: 0xe8d098,
  11: 0xc89858,
  12: 0xc8c0a8,
  13: 0xe0d8c0,
  14: 0xa06830,
  15: 0x585860,
  16: 0xd03030,
  17: 0x4870b0,
  18: 0xf0e0c0,
  19: 0xb0b0c8,
  20: 0xe8c060,
  21: 0x282028,
  22: 0x484058,
  23: 0x706858,
  24: 0x90c050,
  25: 0xe0c040,
  26: 0xf0ece0,
  27: 0x4c6840,
  28: 0x2c4838,
  29: 0xe8e0d0,
  30: 0xf4f0ea,
  31: 0xc06048,
  32: 0x704028,
  33: 0xf8f4e0,
  34: 0x787068,
  35: 0x504840,
  36: 0x68b848,
  37: 0x605850,
  38: 0xc87848,
  39: 0x8c6840,
  40: 0xb09060,
};

function empty() {
  return Array.from({ length: 16 }, () => Array(16).fill('.'));
}

function fill(rows, ch) {
  for (let y = 0; y < 16; y++) rows[y].fill(ch);
}

function rect(rows, x, y, w, h, ch) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      if (yy >= 0 && xx >= 0 && yy < 16 && xx < 16) rows[yy][xx] = ch;
    }
  }
}

function px(rows, x, y, ch) {
  if (y >= 0 && x >= 0 && y < 16 && x < 16) rows[y][x] = ch;
}

function toRows(grid) {
  return grid.map((row) => row.join(''));
}

function grass(speck, flower) {
  const rows = empty();
  fill(rows, 'g');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if ((x * 3 + y * 5 + speck) % 11 === 0) rows[y][x] = 'G';
      if ((x * 7 + y * 2 + speck) % 17 === 0) rows[y][x] = 'd';
      if (flower && (x * 5 + y * 9 + speck) % 23 === 0) rows[y][x] = (x + y) % 2 ? 'f' : 'w';
    }
  }
  return toRows(rows);
}

function forestFloor() {
  const rows = empty();
  fill(rows, 'd');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if ((x + y * 3) % 5 === 0) rows[y][x] = 'G';
      if ((x * 4 + y) % 9 === 0) rows[y][x] = 'g';
    }
  }
  return toRows(rows);
}

function tree() {
  const rows = empty();
  fill(rows, 'd');
  rect(rows, 7, 11, 2, 5, 'e');
  // rund krona
  const spots = [
    [4, 8], [5, 7], [6, 6], [7, 5], [8, 5], [9, 6], [10, 7], [11, 8],
    [3, 9], [12, 9], [3, 10], [12, 10], [4, 11], [11, 11],
  ];
  for (let y = 6; y <= 11; y++) {
    for (let x = 3; x <= 12; x++) {
      const dx = x - 7.5;
      const dy = y - 8.5;
      if (dx * dx + dy * dy < 18) rows[y][x] = (x + y) % 3 === 0 ? 'T' : 't';
    }
  }
  spots.forEach(() => {});
  px(rows, 6, 7, 'g');
  px(rows, 8, 6, 'g');
  return toRows(rows);
}

function mountain(peak) {
  const rows = empty();
  fill(rows, peak ? 'm' : 'M');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const ridge = Math.abs(x - 8) + Math.abs(y - 6);
      if (ridge < 7) rows[y][x] = peak ? 'q' : 'm';
      else if (ridge < 10) rows[y][x] = 'm';
      else rows[y][x] = 'M';
      if ((x + y) % 7 === 0) rows[y][x] = 'K';
    }
  }
  if (peak) rect(rows, 6, 2, 4, 2, 'q');
  return toRows(rows);
}

function water(deep) {
  const rows = empty();
  fill(rows, deep ? 'a' : 'b');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (!deep && (y === 4 || y === 11) && (x + y) % 3 !== 0) rows[y][x] = 'c';
      if (deep && (x * 2 + y) % 8 === 0) rows[y][x] = 'b';
    }
  }
  return toRows(rows);
}

function sand() {
  const rows = empty();
  fill(rows, 's');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if ((x * 3 + y * 4) % 10 === 0) rows[y][x] = 'S';
    }
  }
  return toRows(rows);
}

function path() {
  const rows = empty();
  fill(rows, 'p');
  rect(rows, 0, 0, 16, 1, 'P');
  rect(rows, 0, 15, 16, 1, 'P');
  for (let i = 0; i < 16; i += 4) px(rows, i, 8, 'P');
  return toRows(rows);
}

function road() {
  const rows = empty();
  fill(rows, 'r');
  for (let i = 0; i < 16; i += 4) {
    px(rows, i, 0, 'R');
    px(rows, i, 8, 'R');
    px(rows, 0, i, 'R');
    px(rows, 8, i, 'R');
  }
  return toRows(rows);
}

function bridge() {
  const rows = empty();
  fill(rows, 'b');
  rect(rows, 2, 0, 12, 16, 'n');
  rect(rows, 2, 0, 2, 16, 'R');
  rect(rows, 12, 0, 2, 16, 'R');
  for (let y = 2; y < 16; y += 4) rect(rows, 4, y, 8, 1, 'r');
  return toRows(rows);
}

function dock() {
  const rows = empty();
  fill(rows, 'b');
  for (let y = 0; y < 16; y++) {
    for (let x = 3; x <= 12; x++) rows[y][x] = y % 2 === 0 ? 'o' : 'O';
  }
  rect(rows, 3, 0, 1, 16, 'e');
  rect(rows, 12, 0, 1, 16, 'e');
  return toRows(rows);
}

function rail() {
  const rows = empty();
  fill(rows, 'P');
  for (let x = 0; x < 16; x++) {
    rows[6][x] = 'l';
    rows[10][x] = 'l';
    if (x % 4 === 0) {
      rows[7][x] = 'i';
      rows[8][x] = 'i';
      rows[9][x] = 'i';
    }
  }
  return toRows(rows);
}

function roof(ch, shadow) {
  const rows = empty();
  fill(rows, ch);
  for (let y = 0; y < 16; y++) {
    rows[y][0] = 'K';
    rows[y][15] = 'K';
    if (y % 4 === 0) {
      for (let x = 0; x < 16; x++) rows[y][x] = shadow;
    }
  }
  rect(rows, 0, 0, 16, 1, 'K');
  rect(rows, 0, 15, 16, 1, 'K');
  return toRows(rows);
}

function wall() {
  const rows = empty();
  fill(rows, 'u');
  rect(rows, 0, 0, 16, 16, 'u');
  rect(rows, 2, 8, 4, 6, 'a');
  rect(rows, 10, 3, 3, 4, 'c');
  rect(rows, 0, 14, 16, 2, 'U');
  rect(rows, 0, 0, 16, 1, 'K');
  return toRows(rows);
}

function shop() {
  const rows = empty();
  fill(rows, 'u');
  rect(rows, 0, 0, 16, 6, 'y');
  rect(rows, 0, 6, 16, 2, 'H');
  rect(rows, 6, 9, 4, 7, 'e');
  rect(rows, 2, 8, 3, 3, 'c');
  rect(rows, 11, 8, 3, 3, 'c');
  rect(rows, 0, 0, 16, 1, 'K');
  rect(rows, 0, 15, 16, 1, 'K');
  return toRows(rows);
}

function castle() {
  const rows = empty();
  fill(rows, 'k');
  for (let x = 0; x < 16; x += 4) rect(rows, x, 0, 2, 4, 'K');
  rect(rows, 0, 4, 16, 2, 'M');
  rect(rows, 6, 8, 4, 8, 'K');
  rect(rows, 2, 7, 2, 3, 'a');
  rect(rows, 12, 7, 2, 3, 'a');
  rect(rows, 0, 15, 16, 1, 'K');
  return toRows(rows);
}

function church() {
  const rows = empty();
  fill(rows, 'k');
  // torn
  rect(rows, 6, 0, 4, 7, 'u');
  rect(rows, 7, 1, 2, 2, 'A');
  rect(rows, 0, 6, 16, 2, 'h');
  rect(rows, 0, 8, 16, 8, 'u');
  rect(rows, 6, 9, 4, 7, 'K');
  rect(rows, 2, 9, 2, 3, 'c');
  rect(rows, 12, 9, 2, 3, 'c');
  px(rows, 7, 0, 'K');
  px(rows, 8, 0, 'K');
  rect(rows, 0, 15, 16, 1, 'K');
  return toRows(rows);
}

function station() {
  const rows = empty();
  fill(rows, 'r');
  rect(rows, 0, 2, 16, 4, 'h');
  rect(rows, 0, 6, 16, 6, 'u');
  rect(rows, 2, 7, 2, 3, 'c');
  rect(rows, 7, 7, 2, 3, 'c');
  rect(rows, 12, 7, 2, 3, 'c');
  rect(rows, 0, 12, 16, 4, 'R');
  rect(rows, 0, 14, 16, 1, 'l');
  return toRows(rows);
}

function cave() {
  const rows = mountain(false);
  const grid = rows.map((r) => r.split(''));
  for (let y = 6; y <= 14; y++) {
    for (let x = 5; x <= 10; x++) {
      const dx = (x - 7.5) / 3;
      const dy = (y - 12) / 5;
      if (dx * dx + dy * dy < 1) grid[y][x] = 'K';
    }
  }
  rect(grid, 6, 9, 4, 2, 'M');
  return grid.map((r) => r.join(''));
}

function dungeon() {
  const rows = empty();
  fill(rows, 'M');
  rect(rows, 1, 2, 14, 4, 'm');
  rect(rows, 0, 5, 16, 2, 'K');
  rect(rows, 2, 7, 12, 8, 'k');
  rect(rows, 6, 8, 4, 8, 'K');
  rect(rows, 7, 10, 2, 2, 'A');
  rect(rows, 0, 0, 16, 1, 'K');
  return toRows(rows);
}

function ruins() {
  const rows = empty();
  fill(rows, 'g');
  rect(rows, 2, 4, 3, 10, 'm');
  rect(rows, 11, 6, 3, 8, 'M');
  rect(rows, 5, 8, 4, 2, 'R');
  px(rows, 3, 3, 'K');
  px(rows, 12, 5, 'K');
  return toRows(rows);
}

function wheat() {
  const rows = empty();
  fill(rows, 'Y');
  for (let x = 1; x < 16; x += 2) {
    for (let y = 0; y < 16; y++) rows[y][x] = y % 3 === 0 ? 'y' : 'Y';
  }
  return toRows(rows);
}

function farm() {
  const rows = empty();
  fill(rows, 'g');
  for (let y = 0; y < 16; y++) if (y % 4 === 0) rect(rows, 0, y, 16, 1, 'G');
  return toRows(rows);
}

function windmill() {
  const rows = empty();
  fill(rows, 'g');
  rect(rows, 6, 6, 4, 10, 'u');
  rect(rows, 6, 4, 4, 3, 'h');
  rect(rows, 1, 7, 14, 2, 'W');
  rect(rows, 7, 2, 2, 12, 'W');
  px(rows, 7, 7, 'K');
  px(rows, 8, 7, 'K');
  return toRows(rows);
}

function swamp() {
  const rows = empty();
  fill(rows, 'z');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) if ((x * 2 + y * 3) % 7 === 0) rows[y][x] = 'Z';
  }
  return toRows(rows);
}

function swampWater() {
  const rows = empty();
  fill(rows, 'Z');
  for (let y = 2; y < 16; y += 5) rect(rows, 0, y, 16, 1, 'z');
  return toRows(rows);
}

function plaza() {
  const rows = empty();
  fill(rows, 'r');
  rect(rows, 7, 7, 2, 2, 'A');
  px(rows, 0, 0, 'R');
  px(rows, 15, 0, 'R');
  px(rows, 0, 15, 'R');
  px(rows, 15, 15, 'R');
  return toRows(rows);
}

function ship() {
  const rows = empty();
  fill(rows, 'b');
  rect(rows, 2, 9, 12, 4, 'B');
  rect(rows, 1, 10, 2, 2, 'B');
  rect(rows, 13, 10, 2, 2, 'B');
  rect(rows, 7, 2, 2, 8, 'e');
  rect(rows, 4, 3, 4, 5, 'W');
  px(rows, 3, 9, 'W');
  return toRows(rows);
}

function lighthouse() {
  const rows = empty();
  fill(rows, 's');
  rect(rows, 6, 2, 4, 12, 'W');
  rect(rows, 6, 2, 4, 2, 'h');
  rect(rows, 6, 6, 4, 2, 'h');
  rect(rows, 7, 0, 2, 2, 'A');
  rect(rows, 4, 13, 8, 3, 'M');
  return toRows(rows);
}

function warehouse() {
  const rows = empty();
  fill(rows, 'M');
  rect(rows, 0, 3, 16, 3, 'R');
  rect(rows, 2, 8, 5, 6, 'K');
  rect(rows, 10, 7, 4, 4, 'a');
  rect(rows, 0, 0, 16, 1, 'K');
  rect(rows, 0, 15, 16, 1, 'K');
  return toRows(rows);
}

function mine() {
  const rows = mountain(false);
  const grid = rows.map((r) => r.split(''));
  rect(grid, 4, 8, 8, 7, 'e');
  rect(grid, 6, 10, 4, 6, 'K');
  px(grid, 5, 8, 'A');
  px(grid, 10, 8, 'A');
  return grid.map((r) => r.join(''));
}

function garden() {
  const rows = grass(2, true);
  const grid = rows.map((r) => r.split(''));
  rect(grid, 2, 2, 12, 1, 'e');
  rect(grid, 2, 13, 12, 1, 'e');
  rect(grid, 2, 2, 1, 12, 'e');
  rect(grid, 13, 2, 1, 12, 'e');
  return grid.map((r) => r.join(''));
}

function rock() {
  const rows = empty();
  fill(rows, 'g');
  for (let y = 4; y <= 12; y++) {
    for (let x = 3; x <= 12; x++) {
      const dx = (x - 7) / 5;
      const dy = (y - 8) / 4;
      if (dx * dx + dy * dy < 1) rows[y][x] = (x + y) % 4 === 0 ? 'M' : 'm';
    }
  }
  px(rows, 6, 6, 'q');
  return toRows(rows);
}

function hut() {
  const rows = empty();
  fill(rows, 'g');
  rect(rows, 2, 5, 12, 4, 'h');
  rect(rows, 3, 9, 10, 6, 'e');
  rect(rows, 7, 11, 3, 4, 'K');
  return toRows(rows);
}

function fence() {
  const rows = empty();
  fill(rows, 'g');
  rect(rows, 0, 7, 16, 2, 'e');
  rect(rows, 2, 4, 2, 8, 'e');
  rect(rows, 12, 4, 2, 8, 'e');
  return toRows(rows);
}

function secret() {
  const rows = empty();
  fill(rows, 'M');
  rect(rows, 6, 0, 4, 16, 'p');
  rect(rows, 7, 0, 2, 16, 'P');
  return toRows(rows);
}

const BUILDERS = {
  1: () => grass(0, false),
  2: () => grass(4, false),
  3: () => grass(1, true),
  4: () => forestFloor(),
  5: () => tree(),
  6: () => mountain(false),
  7: () => mountain(true),
  8: () => water(false),
  9: () => water(true),
  10: () => sand(),
  11: () => path(),
  12: () => road(),
  13: () => bridge(),
  14: () => dock(),
  15: () => rail(),
  16: () => roof('h', 'H'),
  17: () => roof('c', 'a'),
  18: () => wall(),
  19: () => castle(),
  20: () => shop(),
  21: () => cave(),
  22: () => dungeon(),
  23: () => ruins(),
  24: () => farm(),
  25: () => wheat(),
  26: () => windmill(),
  27: () => swamp(),
  28: () => swampWater(),
  29: () => plaza(),
  30: () => church(),
  31: () => station(),
  32: () => ship(),
  33: () => lighthouse(),
  34: () => warehouse(),
  35: () => mine(),
  36: () => garden(),
  37: () => rock(),
  38: () => hut(),
  39: () => fence(),
  40: () => secret(),
};

export function terrainRows(id) {
  const build = BUILDERS[id];
  return build ? build() : grass(0, false);
}

// Ritar hela tilesetet till en textur som Phaser kan använda som tilemap.
// Plattan med id N ligger på x = N * 16. Id 0 är bara gräs, den används inte.
export function createTerrainTileset(scene) {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  for (let id = 0; id < TILE_COUNT; id++) {
    const rows = terrainRows(id);
    const ox = id * 16;
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const color = C[ch];
        if (color == null) return;
        g.fillStyle(color);
        g.fillRect(ox + x, y, 1, 1);
      });
    });
  }
  g.generateTexture('terrain', TILE_COUNT * 16, 16);
  g.destroy();
}
