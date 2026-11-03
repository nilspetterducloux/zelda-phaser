// =====================================================================
//  UIScene – HUD:en (hjärtan, antal fiender) och game over-texten.
//  Ligger som en egen scen ovanpå spelet, så den följer inte med kameran.
// =====================================================================
import { FONT_KEY } from '../art/font.js?v=7';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    const { width, height } = this.scale;

    // Svart lista överst, som i klassiska NES-spel
    this.add.rectangle(0, 0, width, 16, 0x000000).setOrigin(0);
    this.add.bitmapText(6, 5, FONT_KEY, '-LIV-').setTint(0xd82800);

    // Hjärtan: varje hjärta = 2 liv (helt, halvt eller tomt)
    this.hearts = [];
    const heartCount = Math.ceil(this.registry.get('maxHealth') / 2);
    for (let i = 0; i < heartCount; i++) {
      this.hearts.push(this.add.image(40 + i * 9, 5, 'heart-full').setOrigin(0));
    }

    this.slimeText = this.add.bitmapText(width - 6, 5, FONT_KEY, '').setOrigin(1, 0);

    // Meddelande i mitten (game over / vinst) – dolt från början
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setVisible(false);
    this.bigText = this.add.bitmapText(width / 2, height / 2 - 12, FONT_KEY, '', 16).setOrigin(0.5);
    this.smallText = this.add.bitmapText(width / 2, height / 2 + 12, FONT_KEY, '').setOrigin(0.5);

    // Rita allt en gång, och sedan varje gång värdena ändras
    this.updateHearts();
    this.updateSlimes();
    this.updateStatus();

    // Lyssna på ändringar i registry
    this.registry.events.on('changedata-health', this.updateHearts, this);
    this.registry.events.on('changedata-enemiesLeft', this.updateSlimes, this);
    this.registry.events.on('changedata-status', this.updateStatus, this);

    // Viktigt: sluta lyssna när scenen stängs (annars dubbla lyssnare vid omstart)
    this.events.once('shutdown', () => {
      this.registry.events.off('changedata-health', this.updateHearts, this);
      this.registry.events.off('changedata-enemiesLeft', this.updateSlimes, this);
      this.registry.events.off('changedata-status', this.updateStatus, this);
    });
  }

  updateHearts() {
    const health = this.registry.get('health');
    this.hearts.forEach((heart, i) => {
      const value = health - i * 2; // hur mycket liv som "hör till" detta hjärta
      if (value >= 2) heart.setTexture('heart-full');
      else if (value === 1) heart.setTexture('heart-half');
      else heart.setTexture('heart-empty');
    });
  }

  updateSlimes() {
    this.slimeText.setText(`KVAR: ${this.registry.get('enemiesLeft')}`);
  }

  updateStatus() {
    const status = this.registry.get('status');
    const show = status !== 'playing';
    this.overlay.setVisible(show);
    this.bigText.setVisible(show);
    this.smallText.setVisible(show);

    if (status === 'gameover') {
      this.bigText.setText('GAME OVER').setTint(0xd82800);
      this.smallText.setText('TRYCK R FÖR ATT FÖRSÖKA IGEN');
    } else if (status === 'won') {
      this.bigText.setText('DU VANN!').setTint(0xf8b800);
      this.smallText.setText('TRYCK R FÖR ATT SPELA IGEN');
    }
  }
}
