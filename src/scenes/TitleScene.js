// =====================================================================
//  TitleScene – titelskärmen som visas innan spelet börjar.
//  Allt ritas som pixlar: solnedgång i breda färgband, en sol,
//  torra buskar och hjälten som en mörk silhuett underifrån
//  med motorsågen lyft över huvudet.
// =====================================================================
import { FONT_KEY } from '../art/font.js?v=3';

// Underrubrik precis under den stora titeln.
// Byt texten här om du vill ha en annan rad. Tom sträng = inget ritas.
export const TITLE_SUBTITLE = 'THE WAY OF THE BAJSKÖRV';

const TITLE = 'MOTORSÅGEN #4';
const PROMPT = 'TRYCK PÅ MELLANSLAG FÖR ATT STARTA';

const WIDTH = 256;
const HEIGHT = 224;
const HORIZON = 174;

// Mörk mark och silhuett. Himlen är orange/gul, så svart läser tydligt.
const INK = 0x000000;
const GROUND = 0x100608;

// Breda band uppifrån och ner, som en NES-solnedgång (inte en mjuk gradient).
const SKY_BANDS = [
  [0x180820, 18],
  [0x301038, 16],
  [0x541428, 16],
  [0x7c1810, 16],
  [0xa82000, 16],
  [0xd03400, 16],
  [0xf04800, 14],
  [0xfc6800, 14],
  [0xfc9000, 16],
  [0xf8b020, 16],
  [0xfcd060, 20],
  [0xfce898, 46],
];

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.started = false;
    this.drawBackdrop();
    this.drawHero();
    this.drawTexts();

    this.keys = this.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
  }

  update() {
    if (this.started) return;
    const go = Phaser.Input.Keyboard.JustDown(this.keys.space)
      || Phaser.Input.Keyboard.JustDown(this.keys.enter);
    if (go) this.startGame();
  }

  startGame() {
    if (this.started) return;
    this.started = true;
    this.scene.start('GameScene');
  }

  // Himlen, solen, marken och några torra buskar.
  drawBackdrop() {
    const g = this.add.graphics();

    let y = 0;
    for (const [color, height] of SKY_BANDS) {
      g.fillStyle(color);
      g.fillRect(0, y, WIDTH, height);
      y += height;
    }

    // Solen sitter på horisonten. Yttre ringar är skenet, kärnan är nästan vit.
    const sunY = HORIZON + 2;
    this.fillCircle(g, 128, sunY, 50, 0xfce888);
    this.fillCircle(g, 128, sunY, 38, 0xfcf4b0);
    this.fillCircle(g, 128, sunY, 26, 0xfffcd8);
    this.fillCircle(g, 128, sunY, 14, 0xfffff0);
    // Korta ljusstreck, som ett enkelt motljus.
    g.fillStyle(0xfff8c8);
    g.fillRect(64, HORIZON, 20, 2);
    g.fillRect(172, HORIZON + 1, 24, 1);
    g.fillRect(126, HORIZON - 42, 3, 14);

    // Marken täcker solens nederkant. Toppen är lite ojämn.
    g.fillStyle(GROUND);
    for (let x = 0; x < WIDTH; x++) {
      const top = HORIZON + this.horizonLift(x);
      g.fillRect(x, top, 1, HEIGHT - top);
    }

    this.drawPlants(g);
  }

  // Små kullar så horisonten inte är ett helt rakt streck.
  horizonLift(x) {
    if (x >= 14 && x <= 46) return -6;
    if (x >= 198 && x <= 240) return -7;
    if (x >= 156 && x <= 178) return -2;
    return 0;
  }

  drawPlants(g) {
    // Buskarna står vid sidan, så de inte täcker benen.
    this.bush(g, 4, HORIZON + 2, 28, 12);
    this.bush(g, 38, HORIZON + 3, 16, 8);
    this.tuft(g, 60, HORIZON + 1, 9, 1);
    this.tuft(g, 68, HORIZON + 2, 5, -1);
    this.tuft(g, 78, HORIZON + 1, 4, 0);
    this.bush(g, 186, HORIZON + 2, 18, 9);
    this.bush(g, 206, HORIZON + 1, 32, 14);
    this.tuft(g, 172, HORIZON + 1, 7, 1);
    this.tuft(g, 164, HORIZON + 2, 4, 0);
  }

  // Ett torrt grässtrå. lean = -1, 0 eller 1 lutar strået.
  tuft(g, x, base, height, lean) {
    g.fillStyle(INK);
    for (let i = 0; i < height; i++) {
      const xx = x + Math.trunc((lean * i) / Math.max(height, 1));
      g.fillRect(xx, base - i, 1, 1);
    }
  }

  // En låg, ojämn buske. Höjden är störst i mitten.
  bush(g, x, base, width, height) {
    const wave = [0, 2, 4, 2, 6, 3, 7, 4, 2, 5, 1, 3, 0, 4];
    g.fillStyle(INK);
    const span = Math.max(1, Math.floor(width / 2));
    for (let i = 0; i < width; i++) {
      const extra = wave[i % wave.length];
      const hh = Math.max(3, Math.floor((height * (span - Math.abs(i - span))) / span) + extra - 1);
      g.fillRect(x + i, base - hh, 1, hh + 2);
    }
  }

  // Hjälten underifrån: korta ben närmare kameran, mage, armarna upp,
  // motorsågen i händerna med stången pekande åt vänster.
  drawHero() {
    const g = this.add.graphics();

    // Fötter och ben i bred ställning.
    g.fillStyle(INK);
    g.fillRect(98, 178, 16, 5);
    g.fillRect(146, 178, 18, 5);
    this.fillLine(g, 110, 156, 106, 180, 5);
    this.fillLine(g, 146, 156, 156, 180, 5);

    // Kalsongerna: ett kort, brett band högt på låren.
    this.fillCircle(g, 128, 152, 15, INK);
    g.fillStyle(INK);
    g.fillRect(114, 146, 28, 7);

    // Rund mage och smalare bröst. Huvudet är mindre (längre från kameran).
    this.fillCircle(g, 128, 134, 17, INK);
    this.fillCircle(g, 128, 116, 12, INK);
    g.fillStyle(INK);
    g.fillRect(124, 104, 8, 7);
    this.fillCircle(g, 129, 98, 9, INK);

    // Armarna når upp till sågen. Händerna ligger mot handtagen.
    this.fillLine(g, 118, 112, 102, 66, 4);
    this.fillLine(g, 140, 112, 168, 76, 4);
    this.fillCircle(g, 102, 64, 5, INK);
    this.fillCircle(g, 170, 74, 5, INK);

    this.drawChainsaw(g);
  }

  // Silhuett av motorsågen: lång stång med tänder, motor och två handtag.
  drawChainsaw(g) {
    // Stången lutar svagt uppåt mot vänster.
    this.fillLine(g, 36, 66, 152, 58, 2);
    g.fillStyle(INK);
    for (let i = 0; i <= 108; i += 6) {
      const x = 38 + i;
      const y = 68 - Math.floor((i * 8) / 108);
      g.fillRect(x, y, 2, 3);
    }

    // Motorn sitter i händerna, till höger.
    this.fillCircle(g, 156, 64, 10, INK);
    g.fillStyle(INK);
    g.fillRect(146, 56, 20, 9);

    // Övre handtaget är en ihålig bygel så himlen syns igenom.
    g.fillRect(146, 46, 18, 3);
    g.fillRect(146, 46, 3, 12);
    g.fillRect(161, 46, 3, 12);

    // Bakre handtaget, där höger hand sluter.
    g.fillRect(166, 68, 10, 3);
    g.fillRect(174, 62, 3, 12);
  }

  drawTexts() {
    // Stor titel med mörk kant så den läser mot himlen.
    // fontSize är teckenbredden i det här typsnittet (inte höjden).
    // 18 px * 13 tecken får plats på 256 px, med lite luft för kanten.
    this.outlinedText(128, 16, TITLE, 18, 0xf83000, 0x140004);

    // Mindre än titeln, gulvit med tunn mörk kant. 23 tecken * 8 px får plats.
    if (TITLE_SUBTITLE) {
      this.outlinedText(128, 38, TITLE_SUBTITLE, 8, 0xfce8a0, 0x140004, 1);
    }

    // Blinkar längst ner på den mörka marken. Utan storlek = en pixel per ruta.
    const prompt = this.add.bitmapText(128, 208, FONT_KEY, PROMPT)
      .setOrigin(0.5)
      .setTint(0xfce8a0);
    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 520,
      yoyo: true,
      repeat: -1,
    });
  }

  // Ritar samma text flera gånger, ett steg åt sidan, som en kantlinje.
  // spread är hur många pixlar kanten sticker ut (2 på titeln, 1 på den lilla raden).
  outlinedText(x, y, text, size, fill, outline, spread = 2) {
    const offsets = spread >= 2
      ? [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]]
      : [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [ox, oy] of offsets) {
      this.add.bitmapText(x + ox, y + oy, FONT_KEY, text, size)
        .setOrigin(0.5)
        .setTint(outline);
    }
    this.add.bitmapText(x, y, FONT_KEY, text, size)
      .setOrigin(0.5)
      .setTint(fill);
  }

  // Fylld cirkel, en pixel i taget, så kanten blir trappsteg och inte mjuk.
  fillCircle(g, cx, cy, radius, color) {
    g.fillStyle(color);
    const r2 = radius * radius;
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= r2) g.fillRect(cx + x, cy + y, 1, 1);
      }
    }
  }

  // Tjock linje av små cirklar. Används till armar, ben och sågens stång.
  fillLine(g, x0, y0, x1, y1, radius) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const x = x0 + Math.trunc(((x1 - x0) * i) / steps);
      const y = y0 + Math.trunc(((y1 - y0) * i) / steps);
      this.fillCircle(g, x, y, radius, INK);
    }
  }
}
