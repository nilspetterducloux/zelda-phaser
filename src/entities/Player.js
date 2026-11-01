// =====================================================================
//  Player – hjälten. Går åt fyra håll, kör motorsåg och kan ta skada.
//  Håll inne mellanslag så går sågen. Den skadar fiender i en kort
//  ruta framför hjälten, med ett litet uppehåll mellan varje träff.
// =====================================================================

// Hur motorsågen sitter för varje riktning.
// dx/dy = var bildens mitt ligger, angle = rotation (0 pekar uppåt),
// w/h = träffytan, tipX/tipY = var gnistorna kommer ut (kedjans spets).
const SAW_POSES = {
  up:    { dx: 0,   dy: -12, angle: 0,   w: 8,  h: 14, tipX: 0,  tipY: -8 },
  down:  { dx: 0,   dy: 13,  angle: 180, w: 8,  h: 14, tipX: 0,  tipY: 8 },
  left:  { dx: -13, dy: 2,   angle: -90, w: 14, h: 8,  tipX: -8, tipY: 0 },
  right: { dx: 13,  dy: 2,   angle: 90,  w: 14, h: 8,  tipX: 8,  tipY: 0 },
};

// Millisekunder mellan varje skada medan sågen ligger mot en fiende.
// Tre träffar fäller en slajm, ungefär samma jobb som tre gamla hugg.
const SAW_TICK_MS = 340;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-down-1');

    // Lägg till i scenen och ge sprite:n en fysikkropp
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Kollisionslådan täcker bara benen/kroppen – lättare att gå i trånga gångar
    this.body.setSize(10, 8).setOffset(3, 8);
    this.setCollideWorldBounds(true);

    // Egenskaper
    this.speed = 80;          // pixlar per sekund
    this.maxHealth = 6;       // 6 = tre hela hjärtan
    this.health = this.maxHealth;
    this.facing = 'down';     // 'up' | 'down' | 'left' | 'right'
    this.sawing = false;
    this.knockedBack = false;
    this.invulnerable = false;
    this.sparkAcc = 0;        // räknare så vi inte spottar gnistor varje bildruta

    // Tangenter: piltangenter + WASD + mellanslag
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,SPACE');

    // Motorsågen: en animerad bild + en osynlig träffyta (zone)
    this.saw = scene.add.sprite(x, y, 'chainsaw-1').setVisible(false);
    this.saw.anims.play('chainsaw-run');
    this.sawHitbox = scene.add.zone(x, y, 8, 14);
    scene.physics.add.existing(this.sawHitbox);
    this.sawHitbox.body.enable = false; // av tills vi håller inne mellanslag

    this.buzz = null; // Web Audio-noder för brummandet, eller null

    // Mellanslag kan redan vara nere när man lämnar titelskärmen.
    // Vänta tills det släpps, så sågen inte startar av sig själv.
    this.sawArmed = !this.keys.SPACE.isDown;

    // Stäng av ljudet om scenen försvinner (omstart, stängd flik)
    scene.events.once('shutdown', () => this.stopSaw());
    this.once('destroy', () => this.stopBuzz());
  }

  update(time, delta) {
    this.setDepth(this.y); // rita framför saker som står "ovanför" oss

    // Under knuff styr vi inte själva, och sågen stannar
    if (this.knockedBack) return;

    if (!this.sawArmed) {
      if (!this.keys.SPACE.isDown) this.sawArmed = true;
    }
    const wantSaw = this.sawArmed && this.keys.SPACE.isDown && this.scene.status === 'playing';
    if (wantSaw) this.startSaw();
    else this.stopSaw();

    this.handleMovement();

    if (this.sawing) {
      this.updateSaw(delta);
      this.updateBuzz(time);
    }
  }

  handleMovement() {
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    let vx = 0;
    let vy = 0;
    // Sågen är tung: man kan gå med den igång, men långsammare
    const speed = this.sawing ? this.speed * 0.6 : this.speed;

    // Bara fyra riktningar (som i gamla Zelda): sidled först, annars upp/ner
    if (left) { vx = -speed; this.facing = 'left'; }
    else if (right) { vx = speed; this.facing = 'right'; }
    else if (up) { vy = -speed; this.facing = 'up'; }
    else if (down) { vy = speed; this.facing = 'down'; }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      // Vänster och höger använder samma bilder, vänster är bara speglad
      const anim = this.facing === 'left' || this.facing === 'right' ? 'walk-side' : `walk-${this.facing}`;
      this.setFlipX(this.facing === 'left');
      this.anims.play(anim, true); // true = starta inte om om den redan spelas
    } else {
      this.showIdleFrame();
    }
  }

  // Stå still och titta åt rätt håll
  showIdleFrame() {
    this.anims.stop();
    const side = this.facing === 'left' || this.facing === 'right';
    this.setTexture(side ? 'hero-side-1' : `hero-${this.facing}-1`);
    this.setFlipX(this.facing === 'left');
  }

  startSaw() {
    if (this.sawing) return;
    this.sawing = true;
    this.sparkAcc = 0;
    this.saw.setVisible(true);
    this.saw.anims.play('chainsaw-run', true);
    this.startBuzz();
  }

  // Flytta sågen, skaka den lite och släpp ut gnistor från spetsen
  updateSaw(delta) {
    const pose = SAW_POSES[this.facing];
    const sx = this.x + pose.dx;
    const sy = this.y + pose.dy;
    // Ett par pixlars skakning så att motorn känns igång
    const jx = Phaser.Math.Between(-1, 1);
    const jy = Phaser.Math.Between(-1, 1);

    this.saw
      .setPosition(sx + jx, sy + jy)
      .setAngle(pose.angle)
      .setDepth(this.facing === 'up' ? this.depth - 1 : this.depth + 1)
      .setVisible(true);

    // Träffytan skakar inte – bara bilden. Annars blir skadan ryckig.
    this.sawHitbox.setPosition(sx, sy).setSize(pose.w, pose.h);
    this.sawHitbox.body.setSize(pose.w, pose.h);
    this.sawHitbox.body.reset(sx, sy);
    this.sawHitbox.body.enable = true;

    this.sparkAcc += delta;
    if (this.sparkAcc >= 45) {
      this.sparkAcc = 0;
      this.spawnSpark(sx + pose.tipX, sy + pose.tipY);
    }
  }

  // En liten gnista eller flisa som flyger åt det håll sågen pekar
  spawnSpark(x, y) {
    const key = Math.random() < 0.5 ? 'spark' : 'chip';
    const bit = this.scene.add.image(x, y, key).setDepth(this.depth + 2);
    const tints = [0xf8b800, 0xfcfcfc, 0xfca044, 0xffffff];
    if (key === 'spark') bit.setTint(Phaser.Utils.Array.GetRandom(tints));

    const dir = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[this.facing];
    this.scene.tweens.add({
      targets: bit,
      x: x + dir[0] * Phaser.Math.Between(6, 14) + Phaser.Math.Between(-4, 4),
      y: y + dir[1] * Phaser.Math.Between(6, 14) + Phaser.Math.Between(-4, 4),
      alpha: 0,
      duration: Phaser.Math.Between(120, 200),
      onComplete: () => bit.destroy(),
    });
  }

  stopSaw() {
    this.sawing = false;
    if (this.saw) this.saw.setVisible(false);
    if (this.sawHitbox && this.sawHitbox.body) this.sawHitbox.body.enable = false;
    this.stopBuzz();
  }

  // Enkelt brummande via Web Audio. Inga ljudfiler – bara oscillatorer och brus.
  // Allt ligger i try/catch så ett strulande ljudkort inte stoppar spelet.
  startBuzz() {
    this.stopBuzz();
    try {
      const sound = this.scene.sound;
      const ctx = sound && sound.context;
      if (!ctx || typeof ctx.createOscillator !== 'function') return;
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(() => {});

      const master = ctx.createGain();
      master.gain.value = 0.03; // lågt, så det inte skriker i högtalarna
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 58;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.4;
      osc.connect(oscGain);
      oscGain.connect(master);

      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.value = 47;
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.value = 0.15;
      osc2.connect(osc2Gain);
      osc2Gain.connect(master);

      // Brus genom ett filter låter mer som en kedja än en ren ton
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 240;
      filter.Q.value = 0.7;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.55;
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);

      this.buzz = { ctx, master, osc, osc2, noise, filter };
      osc.start();
      osc2.start();
      noise.start();
    } catch (err) {
      this.stopBuzz();
    }
  }

  // Låt tonen vaja lite, som en motor som inte går helt jämnt
  updateBuzz(time) {
    if (!this.buzz) return;
    try {
      const now = this.buzz.ctx.currentTime;
      const wobble = 54 + Math.sin(time / 28) * 8;
      this.buzz.osc.frequency.setTargetAtTime(wobble, now, 0.02);
      this.buzz.filter.frequency.setTargetAtTime(200 + Math.sin(time / 40) * 70, now, 0.03);
    } catch (err) {
      this.stopBuzz();
    }
  }

  stopBuzz() {
    const buzz = this.buzz;
    this.buzz = null;
    if (!buzz) return;
    try {
      buzz.osc.stop();
      buzz.osc2.stop();
      buzz.noise.stop();
      buzz.master.disconnect();
    } catch (err) {
      // redan stoppad – inget att göra
    }
  }

  // Anropas när sågens träffyta överlappar en slajm.
  // Samma slajm kan träffas igen efter SAW_TICK_MS, så länge sågen är kvar.
  sawHits(slime) {
    if (!this.sawing || !slime.active || slime.hurt) return;
    const now = this.scene.time.now;
    if (now < (slime.nextSawHit || 0)) return;
    slime.nextSawHit = now + SAW_TICK_MS;
    slime.takeHit(this.x, this.y);
  }

  // Anropas när en fiende nuddar oss
  takeDamage(enemy) {
    if (this.invulnerable || this.scene.status !== 'playing') return;

    this.health = Math.max(0, this.health - 1);
    this.scene.registry.set('health', this.health);
    if (this.sawing) this.stopSaw();

    // Knuff: flyg bort från fienden en kort stund
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.x, this.y);
    this.knockedBack = true;
    this.setVelocity(Math.cos(angle) * 180, Math.sin(angle) * 180);
    this.scene.time.delayedCall(150, () => {
      this.knockedBack = false;
      this.setVelocity(0, 0);
    });

    // Kort osårbarhet – blinka så att man ser det
    this.invulnerable = true;
    const blink = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 80,
      yoyo: true,
      repeat: -1,
    });
    this.scene.time.delayedCall(1000, () => {
      blink.stop();
      this.setAlpha(1);
      this.invulnerable = false;
    });

    if (this.health <= 0) this.scene.onPlayerDied();
  }
}
