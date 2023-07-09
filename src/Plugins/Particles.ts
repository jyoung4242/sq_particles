import { v4 as uuidv4 } from "uuid";

type ParticleSystemContainType = "hidden" | "visible";

export interface ParticleSystemConfig {
  containtype: ParticleSystemContainType;
  width: number;
  height: number;
  xposition: number;
  yposition: number;
  poolSize: number;
}

export class ParticleSystem {
  id: string;
  public template = `
  <style>
    particle-system{
      overflow: \${psystems.containtype};
      font-size: xx-small;
    }

    particle-system,
    particle-emitter,
    part-icle {
      display: block;
      position: absolute;
      background-size: contain;
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
    NUM Particles: \${psystems.numParticles} 
    poolsize: \${psystems.poolsize}   
        <ps-relative>
            <particle-emitter \${emitter<=*psystems.emitters:id}  style="top: -\${emitter.centerpoint.y}px; left: -\${emitter.centerpoint.x}px;transform: translate3d(\${emitter.position.x}px,\${emitter.position.y}px,0px) rotate(\${emitter.angle}deg); width: \${emitter.size.w}px; height: \${emitter.size.h}px; border: ; background-image: url(\${emitter.imageSrc});"></particle-emitter>
            <part-icle \${particle<=*psystems.particles:id}   style="top: -\${particle.centerpointY}px; left: -\${particle.centerpointX}px;transform: translate3d(\${particle.xposition}px,\${particle.yposition}px,0px) rotate(\${particle.angle}deg) scale(\${particle.scale}); width: \${particle.width}px; height: \${particle.height}px;  background-image: url(\${particle.imageSrc}); \${particle.customCSS}"></part-icle>
        </ps-relative>
    </particle-system>
  `;
  containtype: string;
  public emitters: Array<ParticleEmitter>;
  public particles: Array<Particle>;
  public position = { x: 0, y: 0 };
  public size = { w: 0, h: 0 };
  pool: ParticlePool;
  centerpoint = { x: 0, y: 0 };
  isBordershowing = false;
  numParticles: number = 0;
  poolsize: number;

  constructor(config: ParticleSystemConfig) {
    this.pool = new ParticlePool(this, config.poolSize);
    this.id = uuidv4();
    this.containtype = config.containtype;
    this.poolsize = 0;
    this.emitters = [];
    this.particles = [];
    this.position.x = config.xposition;
    this.position.y = config.yposition;
    this.size.w = config.width;
    this.size.h = config.height;
    this.centerpoint.x = this.size.w / 2;
    this.centerpoint.y = this.size.h / 2;
  }
  createSystem() {}
  createEmitter(this: ParticleSystem, emitterConfig: EmitterConfig) {
    this.emitters.push(new ParticleEmitter(this, emitterConfig));
  }
  destroyEmitter(id: string) {
    const emitterIndex = this.emitters.findIndex(emitter => emitter.id == id);
    if (emitterIndex != -1) this.emitters.splice(emitterIndex, 1);
  }

  update(deltaTime: number, now: number) {
    this.emitters.forEach(emitter => emitter.update(deltaTime));
    this.particles.forEach(particle => particle.update(deltaTime));
    this.numParticles = this.particles.length;
    this.poolsize = this.pool.pool.length;
  }
}

type EmitterShape = "Point" | "Circle" | "Square";

export interface EmitterConfig {
  type: EmitterShape;
  originOffset: { x: number; y: number };
  width: number;
  height: number;
  xposition: number;
  yposition: number;
  angle: number;
  imageSrc?: string;
  isVisible: boolean;
}

export class ParticleEmitter {
  id: string;
  isVisible = true;
  parentSystem: ParticleSystem;
  imageSrc: string;
  position = { x: 0, y: 0 };
  originOffset = { x: 0, y: 0 };
  size = { w: 0, h: 0 };
  centerpoint = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  rotationalVelocity = 0;
  angle = 0;
  get angleRad() {
    return this.angle * (Math.PI / 180);
  }
  constructor(parent: ParticleSystem, config: EmitterConfig) {
    this.id = uuidv4();
    this.isVisible = config.isVisible;
    this.parentSystem = parent;
    this.position.x = config.xposition;
    this.position.y = config.yposition;
    this.size.w = config.width;
    this.size.h = config.height;
    this.centerpoint.x = this.size.w / 2;
    this.centerpoint.y = this.size.h / 2;
    this.originOffset.x = config.originOffset.x;
    this.originOffset.y = config.originOffset.y;
    this.angle = config.angle;
    config.imageSrc ? (this.imageSrc = config.imageSrc) : (this.imageSrc = "");
  }

  createParticle(newparticle: ParticleConfig, imageSource?: string): Particle {
    let newPart;
    if (this.parentSystem.pool.pool.length > 0) {
      newPart = this.parentSystem.pool.getParticleFromPool(newparticle);
      this.parentSystem.particles.push(newPart as Particle);
    } else {
      //@ts-ignore
      imageSource
        ? (newPart = new Particle(this, newparticle as ParticleConfig, imageSource))
        : (newPart = new Particle(this, newparticle as ParticleConfig));
      this.parentSystem.particles.push(newPart as Particle);
    }
    return newPart as Particle;
  }

  setVelocity(vel: { x: number; y: number }) {
    this.velocity.x = vel.x;
    this.velocity.y = vel.y;
  }
  getVelocity() {
    return this.velocity;
  }
  setRotation(rot: number) {
    this.rotationalVelocity = rot;
  }
  getRotation() {
    return this.rotationalVelocity;
  }
  getAngle() {
    return this.angle;
  }

  destroyParticle(id: string) {
    const deadParticle = this.parentSystem.particles.findIndex(particle => particle.id == id);
    if (deadParticle != -1) {
      this.parentSystem.pool.moveToPool(deadParticle);
    }
  }

  update(deltaTime: number) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.angle += this.rotationalVelocity;
  }
}

export interface ParticleConfig {
  width: number;
  height: number;
  angle: number;
  velocity: { x: number; y: number };
  lifespan: number;
  scale: number;
  isVisible: boolean;
}

export class Particle {
  id: string;
  isVisible = true;
  static config: ParticleConfig | undefined;
  emitter: ParticleEmitter;
  imageSrc: string;
  xposition = 0;
  yposition = 0;
  centerpointX: number;
  centerpointY: number;
  velocity = { x: 0, y: 0 };
  rotationalVelocity = 0;
  width = 0;
  height = 0;
  angle = 0;
  lifespan = 0;
  scale = 1;
  customCSS: string = "";

  constructor(sourceEmitter: ParticleEmitter, config: ParticleConfig, imagesource?: string) {
    this.id = uuidv4();
    this.isVisible = config.isVisible;
    this.emitter = sourceEmitter;
    this.xposition = this.emitter.position.x + this.emitter.originOffset.x;
    this.yposition = this.emitter.position.y + this.emitter.originOffset.y;
    this.width = config.width;
    this.height = config.height;
    this.centerpointX = this.width / 2;
    this.centerpointY = this.height / 2;
    this.angle = config.angle;
    this.velocity.x = config.velocity.x;
    this.velocity.y = config.velocity.y;
    this.scale = config.scale;
    this.lifespan = config.lifespan;
    imagesource ? (this.imageSrc = imagesource) : (this.imageSrc = "");
  }
  destroy(id: string) {
    this.emitter.destroyParticle(id);
  }

  update(deltaTime: number) {
    this.xposition += this.velocity.x;
    this.yposition += this.velocity.y;
    this.angle += this.rotationalVelocity;
    this.lifespan -= deltaTime;
    if (this.lifespan <= 0) {
      this.destroy(this.id);
    }
  }

  setVelocity(vel: { x: number; y: number }) {
    this.velocity.x = vel.x;
    this.velocity.y = vel.y;
  }
  getVelocity() {
    return this.velocity;
  }
  setRotation(rot: number) {
    this.rotationalVelocity = rot;
  }
  getRotation() {
    return this.rotationalVelocity;
  }
  getAngle() {
    return this.angle;
  }
}

export class ParticlePool {
  parent: ParticleSystem;
  pool: Array<Particle> = [];
  poolsize: number;
  poolIndex: number;

  constructor(parent: ParticleSystem, poolsize: number) {
    this.parent = parent;
    this.poolsize = poolsize;
    this.poolIndex = 0;
  }

  getParticleFromPool(config: ParticleConfig): Particle | void {
    let newPart = this.pool.pop();
    if (newPart) {
      newPart.lifespan = config.lifespan;
      newPart.velocity.x = config.velocity.x;
      newPart.velocity.y = config.velocity.y;
      newPart.xposition = newPart.emitter.position.x + newPart.emitter.originOffset.x;
      newPart.yposition = newPart.emitter.position.y + newPart.emitter.originOffset.y;

      return newPart;
    }
  }

  moveToPool(index: number) {
    this.pool.push(...this.parent.particles.splice(index, 1));
  }
}
