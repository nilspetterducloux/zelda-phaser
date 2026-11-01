// =====================================================================
//  BootScene – körs först. Skapar all grafik, typsnitt och animationer
//  i kod och startar sedan själva spelet.
// =====================================================================
import { createTextures, createAnimations } from '../art/makeTextures.js';
import { createPixelFont } from '../art/font.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    createTextures(this);
    createPixelFont(this);
    createAnimations(this);
    this.scene.start('GameScene');
  }
}
