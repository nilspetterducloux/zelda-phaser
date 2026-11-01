// =====================================================================
//  font.js – ett eget pixel-typsnitt (5x5 pixlar per tecken)
//  Vi ritar alla tecken till en textur och gör om den till ett
//  "RetroFont" som kan användas med this.add.bitmapText(...).
//  Svenska Å, Ä och Ö får prickar/ring ovanför bokstaven.
// =====================================================================

export const FONT_KEY = 'pixelfont';
const CELL_W = 6; // 5 pixlar + 1 pixel mellanrum
const CELL_H = 8; // 2 rader för prickar + 5 rader bokstav + 1 mellanrum

// Varje tecken: 5 rader med 5 pixlar. '#' = pixel, '.' = tomt.
const A = ['.###.', '#...#', '#####', '#...#', '#...#'];
const O = ['.###.', '#...#', '#...#', '#...#', '.###.'];

const GLYPHS = {
  A, O,
  B: ['####.', '#...#', '####.', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '####.', '#....', '#####'],
  F: ['#####', '#....', '####.', '#....', '#....'],
  G: ['.####', '#....', '#..##', '#...#', '.###.'],
  H: ['#...#', '#...#', '#####', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '###..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#'],
  P: ['####.', '#...#', '####.', '#....', '#....'],
  Q: ['.###.', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '####.', '#..#.', '#...#'],
  S: ['.####', '#....', '.###.', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  Y: ['#...#', '.#.#.', '..#..', '..#..', '..#..'],
  Z: ['#####', '...#.', '..#..', '.#...', '#####'],
  0: ['.###.', '#..##', '#.#.#', '##..#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '.###.'],
  2: ['####.', '....#', '.###.', '#....', '#####'],
  3: ['####.', '....#', '.###.', '....#', '####.'],
  4: ['#...#', '#...#', '#####', '....#', '....#'],
  5: ['#####', '#....', '####.', '....#', '####.'],
  6: ['.###.', '#....', '####.', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '..#..'],
  8: ['.###.', '#...#', '.###.', '#...#', '.###.'],
  9: ['.###.', '#...#', '.####', '....#', '.###.'],
  ' ': ['.....', '.....', '.....', '.....', '.....'],
  '!': ['..#..', '..#..', '..#..', '.....', '..#..'],
  '.': ['.....', '.....', '.....', '.....', '..#..'],
  ':': ['.....', '..#..', '.....', '..#..', '.....'],
  '-': ['.....', '.....', '.###.', '.....', '.....'],
};

// Prickar/ring ovanför (2 rader) för de svenska bokstäverna
const ACCENTS = {
  'Å': { base: A, top: ['..#..', '.....'] },
  'Ä': { base: A, top: ['.#.#.', '.....'] },
  'Ö': { base: O, top: ['.#.#.', '.....'] },
};

// Alla tecken i den ordning de ritas in i texturen
export const FONT_CHARS = Object.keys(GLYPHS).join('') + Object.keys(ACCENTS).join('');

// Ritar typsnittet till en textur och registrerar det hos Phaser
export function createPixelFont(scene) {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffffff); // vitt – vi kan färga texten med setTint() senare

  [...FONT_CHARS].forEach((ch, index) => {
    let rows;
    if (ACCENTS[ch]) {
      rows = [...ACCENTS[ch].top, ...ACCENTS[ch].base];
    } else {
      rows = ['.....', '.....', ...GLYPHS[ch]]; // tomma rader där prickar annars sitter
    }
    rows.forEach((row, y) => {
      [...row].forEach((pixel, x) => {
        if (pixel === '#') g.fillRect(index * CELL_W + x, y, 1, 1);
      });
    });
  });

  g.generateTexture(FONT_KEY, FONT_CHARS.length * CELL_W, CELL_H);
  g.destroy();

  // Berätta för Phaser hur texturen är uppdelad i tecken
  const fontConfig = {
    image: FONT_KEY,
    width: CELL_W,
    height: CELL_H,
    chars: FONT_CHARS,
    charsPerRow: FONT_CHARS.length,
    spacing: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  };
  // RetroFont.Parse ger tillbaka ett färdigt typsnitt som vi lägger i cachen
  scene.cache.bitmapFont.add(FONT_KEY, Phaser.GameObjects.RetroFont.Parse(scene, fontConfig));
}
