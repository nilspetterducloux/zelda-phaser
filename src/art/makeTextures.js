// =====================================================================
//  makeTextures.js – gör om pixel-matriserna till riktiga texturer
//  Vi ritar varje pixel som en 1x1-rektangel med Phaser.Graphics och
//  sparar resultatet med generateTexture(). Ingen extern grafik behövs!
// =====================================================================
import { PALETTE } from './palette.js';
import * as S from './sprites.js';

// Ritar en pixel-matris till en textur med namnet "key"
function makeTexture(scene, key, rows) {
  const height = rows.length;
  const width = Math.max(...rows.map((r) => r.length));
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  rows.forEach((row, y) => {
    [...row].forEach((char, x) => {
      const color = PALETTE[char];
      if (color === undefined) return; // '.' (eller okänt tecken) = genomskinligt
      g.fillStyle(color);
      g.fillRect(x, y, 1, 1);
    });
  });

  g.generateTexture(key, width, height);
  g.destroy();
}

// Spegelvänder en bild horisontellt (används för gånganimationen)
function mirror(rows) {
  return rows.map((row) => [...row].reverse().join(''));
}

// Skapar alla texturer som spelet använder
export function createTextures(scene) {
  // Hjälten: två bildrutor per riktning
  makeTexture(scene, 'hero-down-1', S.HERO_DOWN);
  makeTexture(scene, 'hero-down-2', mirror(S.HERO_DOWN));
  makeTexture(scene, 'hero-up-1', S.HERO_UP);
  makeTexture(scene, 'hero-up-2', mirror(S.HERO_UP));
  makeTexture(scene, 'hero-side-1', S.HERO_SIDE_1);
  makeTexture(scene, 'hero-side-2', S.HERO_SIDE_2);

  // Fiender och vapen
  makeTexture(scene, 'slime-1', S.SLIME_1);
  makeTexture(scene, 'slime-2', S.SLIME_2);
  makeTexture(scene, 'sword', S.SWORD);
  makeTexture(scene, 'puff', S.PUFF);

  // Kartrutor
  makeTexture(scene, 'sand', S.SAND);
  makeTexture(scene, 'grass', S.GRASS);
  makeTexture(scene, 'tree', S.TREE);
  makeTexture(scene, 'rock', S.ROCK);
  makeTexture(scene, 'water', S.WATER);

  // Livmätare
  makeTexture(scene, 'heart-full', S.HEART_FULL);
  makeTexture(scene, 'heart-half', S.HEART_HALF);
  makeTexture(scene, 'heart-empty', S.HEART_EMPTY);
}

// Skapar animationerna (bildrutorna måste finnas först)
export function createAnimations(scene) {
  const walk = (key, frames) =>
    scene.anims.create({
      key,
      frames: frames.map((f) => ({ key: f })),
      frameRate: 8,
      repeat: -1, // -1 = loopa för evigt
    });

  walk('walk-down', ['hero-down-1', 'hero-down-2']);
  walk('walk-up', ['hero-up-1', 'hero-up-2']);
  walk('walk-side', ['hero-side-1', 'hero-side-2']);

  scene.anims.create({
    key: 'slime-wobble',
    frames: [{ key: 'slime-1' }, { key: 'slime-2' }],
    frameRate: 3,
    repeat: -1,
  });
}
