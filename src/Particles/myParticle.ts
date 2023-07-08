import { Particle, ParticleEmitter, ParticleSystem, EmitterConfig, ParticleSystemConfig, ParticleConfig } from "../Plugins/Particles";
import { Assets } from "@peasy-lib/peasy-assets";

export class myParticleSystem extends ParticleSystem {
  assets: any;
  constructor(assets: any) {
    const config: ParticleSystemConfig = {
      width: 100,
      height: 100,
      xposition: 100,
      yposition: 100,
    };
    super(config);
    this.assets = assets;
  }

  createEmitter(): void {
    const newEmitter = new myParticleEmitter(this.assets.image("bubblegun").src, this.assets.image("bubble").src);
    this.emitters.push(newEmitter);
  }
}

export class myParticleEmitter extends ParticleEmitter {
  bubbleImage: string;
  constructor(imageSource: string, particleimagesource: string) {
    const config: EmitterConfig | ParticleEmitter = {
      width: 16,
      height: 16,
      xposition: 20,
      yposition: 20,
      angle: 0,
      imageSrc: imageSource,
    };

    super(config);
    this.bubbleImage = particleimagesource;
    this.createMyParticle();
  }
  createMyParticle(): void {
    const newPart = new myParticles(this.bubbleImage);
    this.createParticle(newPart);
  }
}

export class myParticles extends Particle {
  constructor(imgsrc: string) {
    const config: ParticleConfig = {
      width: 16,
      height: 16,
      xposition: 0,
      yposition: 0,
      angle: 0,
      imageSrc: imgsrc,
      lifespan: 2000,
      velocity: { x: 0, y: 0 },
      scale: 0.25,
    };
    super(config);
    console.log(this);
  }
}
