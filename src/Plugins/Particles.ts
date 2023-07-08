export interface ParticleSystemConfig {
  width: number;
  height: number;
  xposition: number;
  yposition: number;
}
//"transform: translate3d(\${psystems.position.x}px,\${psystems.position.y}px,0px); width: \${psystems.size.w}px; height: \${psystems.size.h}px; border: '1px solid white';">
export class ParticleSystem {
  public template = `
  <style>
    particle-system,
    particle-emitter,
    part-icle {
      display: block;
      position: absolute;
      background-size: cover;
      image-rendering: pixelated;
    }
    ps-relative,
    em-relative{
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
    }
    particle-emitter,
    part-icle{
        transform-origin: center;
    }

  </style>
    <particle-system style="top:-\${psystems.centerpoint.y}px;left:-\${psystems.centerpoint.x}px;transform: translate3d(\${psystems.position.x}px,\${psystems.position.y}px,0px); width: \${psystems.size.w}px; height: \${psystems.size.h}px; border: 1px solid white;">
        <ps-relative>
            <particle-emitter \${emitter<=*psystems.emitters} style="top: -\${emitter.centerpoint.y}px; left: -\${emitter.centerpoint.x}px;transform: translate3d(\${emitter.position.x}px,\${emitter.position.y}px,0px) rotate(\${emitter.angle}deg); width: \${emitter.size.w}px; height: \${emitter.size.h}px; border: ; background-image: url(\${emitter.imageSrc});">
                <em-relative>
                    <part-icle \${particle<=*emitter.particles} style="top: -\${particle.centerpointY}px; left: -\${particle.centerpointX}px;transform: translate3d(\${particle.xposition}px,\${particle.yposition}px,0px) rotate(\${particle.angle}deg) scale(\${particle.scale}); width: \${particle.width}px; height: \${particle.height}px; border: 1px solid yellow ; background-image: url(\${particle.imageSrc});"></part-icle>
                </em-relative>
            </particle-emitter>
        </ps-relative>
        
    </particle-system>
  `;
  public emitters: Array<ParticleEmitter>;
  public position = { x: 0, y: 0 };
  public size = { w: 0, h: 0 };
  centerpoint = { x: 0, y: 0 };
  isBordershowing = false;

  constructor(config: ParticleSystemConfig) {
    this.emitters = [];
    this.position.x = config.xposition;
    this.position.y = config.yposition;
    this.size.w = config.width;
    this.size.h = config.height;
    this.centerpoint.x = this.size.w / 2;
    this.centerpoint.y = this.size.h / 2;
  }
  createSystem() {}
  createEmitter(emitterConfig: EmitterConfig) {
    this.emitters.push(new ParticleEmitter(emitterConfig));
  }
  destroyEmitter() {}
  update() {}
}

export interface EmitterConfig {
  width: number;
  height: number;
  xposition: number;
  yposition: number;
  angle: number;
  imageSrc?: string;
}

export class ParticleEmitter {
  particles: Array<Particle>;
  imageSrc: string;
  position = { x: 0, y: 0 };
  size = { w: 0, h: 0 };
  centerpoint = { x: 0, y: 0 };
  angle = 0;
  get angleRad() {
    return this.angle * (Math.PI / 180);
  }
  constructor(config: EmitterConfig) {
    this.particles = [];
    this.position.x = config.xposition;
    this.position.y = config.yposition;
    this.size.w = config.width;
    this.size.h = config.height;
    this.centerpoint.x = this.size.w / 2;
    this.centerpoint.y = this.size.h / 2;
    this.angle = config.angle;
    config.imageSrc ? (this.imageSrc = config.imageSrc) : (this.imageSrc = "");
  }
  createParticle(newparticle: ParticleConfig | Particle) {
    let newPart;

    //@ts-ignore
    if (newparticle! instanceof Particle) newPart = new Particle(newparticle as ParticleConfig); //config
    else newPart = newparticle; //class
    this.particles.push(newPart as Particle);
  }
  destroyParticle() {}
  update() {}
}

export interface ParticleConfig {
  width: number;
  height: number;
  xposition: number;
  yposition: number;

  angle: number;
  imageSrc?: string;
  velocity: { x: number; y: number };
  lifespan: number;
  scale: number;
}

export class Particle {
  imageSrc: string;
  xposition = 0;
  yposition = 0;
  unadjustedX = 0;
  unadjustedY = 0;
  centerpointX: number;
  centerpointY: number;
  velocity = { x: 0, y: 0 };
  width = 0;
  height = 0;
  angle = 0;
  lifespan = 0;
  scale = 1;

  get angleRad() {
    return this.angle * (Math.PI / 180);
  }
  constructor(config: ParticleConfig) {
    this.unadjustedX = config.xposition;
    this.unadjustedY = config.yposition;
    this.width = config.width;
    this.height = config.height;
    this.centerpointX = this.width / 2;
    this.centerpointY = this.height / 2;
    this.angle = config.angle;
    this.velocity.x = config.velocity.x;
    this.velocity.y = config.velocity.y;
    this.scale = config.scale;
    this.lifespan = config.lifespan;
    config.imageSrc ? (this.imageSrc = config.imageSrc) : (this.imageSrc = "");
  }
  destroy() {}
  update() {}
}
