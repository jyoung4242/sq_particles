import { Particle, ParticleEmitter, ParticleSystem, EmitterConfig, ParticleSystemConfig, ParticleConfig } from "../Plugins/Particles";
/***********************************************************
 * Content of PlugIn: DOM Based Particle System
 * this is the content application of the custom plug-in
 * this example creates a particle system, and one emitter
 * the emitter has an image bound to it
 * and the emitter simply has an interval tied to it that spits
 * out particles at a determined rate
 * The particles simply move at a random velocity
 * and random lifespan
 * and have a bubble image attached to them, as well as a string
 * of custom CSS, which is the secret power of this library
 ************************************************************/

export class myParticleSystem extends ParticleSystem {
  assets: any;
  constructor(assets: any) {
    const config: ParticleSystemConfig = {
      containtype: "visible",
      width: 100,
      height: 100,
      xposition: 100,
      yposition: 150,
      poolSize: 300,
    };
    super(config);
    this.assets = assets;
  }

  createEmitter(): void {
    const newEmitter = new myParticleEmitter(this, this.assets.image("bubblegun").src, this.assets.image("bubble").src);
    this.emitters.push(newEmitter);
  }
}

export class myParticleEmitter extends ParticleEmitter {
  bubbleImage: string;
  myInterval: number;
  constructor(parent: ParticleSystem, imageSource: string, particleimagesource: string) {
    const config: EmitterConfig | ParticleEmitter = {
      type: "Point",
      originOffset: { x: 10, y: -0.25 }, //from emitter center
      width: 16,
      height: 16,
      xposition: 10,
      yposition: 48,
      angle: 0,
      imageSrc: imageSource,
      isVisible: true,
    };

    super(parent, config);
    this.bubbleImage = particleimagesource;
    this.myInterval = setInterval(() => {
      this.createMyParticle();
      this.createMyParticle();
    }, 50);
  }

  createMyParticle(): void {
    const newPart = myParticles.config;
    let part = this.createParticle(newPart, this.bubbleImage);
    part.setVelocity({ x: Math.random() * 2, y: Math.random() * 0.5 - 0.25 });
  }
}

export class myParticles extends Particle {
  static config: ParticleConfig = {
    width: 4,
    height: 4,
    angle: 0,
    lifespan: Math.random() * 8000,
    velocity: { x: 0, y: 0 },
    scale: 1,
    isVisible: true,
    customCSS: "box-shadow: 0px 0px 1px 1px rgba(45,255,196,0.9); border-radius: 50%;",
  };
}
