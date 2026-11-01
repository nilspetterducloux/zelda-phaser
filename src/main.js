// =====================================================================
//  main.js – startpunkten för spelet
//  Här ställer vi in Phaser: upplösning, skalning, fysik och scener.
// =====================================================================
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,          // WebGL om det finns, annars Canvas
  parent: 'game',             // id på <div> i index.html
  backgroundColor: '#000000',

  // Låg upplösning som på NES (256x224). Allt skalas sedan upp.
  width: 256,
  height: 224,

  // 8-bit-känsla: inga suddiga kanter och pixlar som hamnar på heltal
  pixelArt: true,
  roundPixels: true,

  scale: {
    mode: Phaser.Scale.FIT,               // skala upp så mycket som får plats
    autoCenter: Phaser.Scale.CENTER_BOTH, // centrera i fönstret
  },

  // Arcade-fysik: enkel och snabb, perfekt för top-down-spel
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // ingen gravitation – vi ser världen uppifrån
      debug: false,            // sätt till true för att se kollisionslådor
    },
  },

  // Boot skapar grafik och startar titeln. Resten startas därifrån.
  scene: [BootScene, TitleScene, GameScene, UIScene],
};

// Skapa spelet! (sparas på window så du kan leka med det i konsolen)
window.game = new Phaser.Game(config);
