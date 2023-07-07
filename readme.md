# Design Doc - Squeleto Particles

## Summary

The goal of this module is to provide an easy abstraction interface to a entry level particle system for the Squeleto Framework.</code>

## Features

- 3 parts, the particle system (element), the particle emitter (generator), the particle (component)
  - System
    - the semantic div element that will house the overall boundaries of which particles can exist
  - Emitter
    - the source region (point or area) that generates new particles
  - Particle
    - the semantic div element that contains ALL the necessary particle components
- current structure plan

  ```html
  <style>
    particle-system,
    particle-emitter,
    part-icle {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      background-size: cover;
    }
  </style>
  <particle-system style="transform: translate3d(x,y,z); width: w; height: h; border: '';">
    <particle-emitter
      style="transform:translate3d(x,y,z);width:w;height:h;border:'';background-image:url();background-position:(x px, y px);"
      ><part-icle
        style="transform:translate3d(x,y,z);width:w;height:h;border:'';background-image:url();background-position:(x px, y px);"
      ></part-icle>
      <part-icle
        style="transform:translate3d(x,y,z);width:w;height:h;border:'';background-image:url();background-position:(x px, y px);"
      ></part-icle>
      <part-icle
        style="transform:translate3d(x,y,z);width:w;height:h;border:'';background-image:url();background-position:(x px, y px);"
      ></part-icle>
      ...
    </particle-emitter>
  </particle-system>
  ```

- Systems ( of which can be multiple particle systems behaving independently) will be managed in the data-model for the Scene as a list
  of particle systems, each system will have a uuid
- Emitters, of which each System can have multiple Emitters, will be managed in the data-model, under each system, as a list of
  emitters, each emitter will have a uuid
- Particles, of which each Emitter can have multiple particles, whill be managed in the data-model, under each emitter, as a list of
  particles, each particle will have a uuid

## UI

    ### Systems

            The Systems themselves will provide a boundary area, or region, that particles CAN exist in
            properties will include, size: x, y, position, x:y, and diagnostic boundary i.e. isVisible and Color of particle region area border
            also included will be the transform for moving

    ### Emitters

            The Emitters will have the same fundamental properties of the systems, including additional properties,
            sprite-layers for spritesheet or static sprite images, also will have shape attribute for the particle generation region

    ### Particles

            The particles will have the same fundamental properties of the systems, including a transform set of properties that change over lifetime of particle from 0-1
            The collective group of particles will have a universal style class, AS WELL AS each particle having the potential to custom change its inline css string

## Methods

    ### Systems

        - The systems methods will start with the create and destroy methods.  These will allocate the entire property structure into the data-model for peasy in the list so that its rendered propeerly, destroy, splices the system out of the data model list

        - Create/Destroy Emitter - similar approach for emitters as systems, within the data model for systems, will be emitters array, which this will manage the insertion and splicing of emitters

        - update method will process the delta time changes to all the child emitters

    ### Emitters

        - The emitters will have a create/destroy method for individual particles

        - Update() this method will run the update method on all child particles for this emitter

    ### Particles
        - destroy() a particle needs to be able to remove itself
        - create() method to manage data validation prior to returning the constructor
        - applyTransform()
        - update()

## Plug-in integration

    ### System (non content portion)

    - /Plugins/Particles.ts
        - particle system class
        - particle emitter class
        - particle class

    ### Content
    - /Particles/myParticle.ts
        - unique particle/emitter config
            - myParticle system extends system class
            - myEmitter extends emitter class
            - myParticle extends particle class
