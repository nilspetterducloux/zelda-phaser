// =====================================================================
//  BootScene – körs först. Skapar all grafik, typsnitt och animationer
//  i kod och startar sedan titelskärmen.
// =====================================================================
import { createTextures, createAnimations } from '../art/makeTextures.js?v=4';
import { createPixelFont } from '../art/font.js?v=4';
import { createTerrainTileset } from '../art/terrain.js?v=4';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    createTextures(this);
    createTerrainTileset(this);
    createPixelFont(this);
    createAnimations(this);
    this.scene.start('TitleScene');
  }
}
