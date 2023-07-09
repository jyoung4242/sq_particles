import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Assets } from "@peasy-lib/peasy-assets";
import { Engine } from "@peasy-lib/peasy-engine";
import { Input } from "@peasy-lib/peasy-input";
import { ParticleSystem } from "./Plugins/Particles";
import { myParticleEmitter, myParticleSystem } from "./Particles/myParticle";

Assets.initialize({ src: "./src/assets/" });
await Assets.load(["bubblegun.png", "bubble.png"]);
const PS = new myParticleSystem(Assets);

const model = {
  psystems: PS,
  fps: "",
};
const template = `<div class="test">
  ${PS.template}
  <div class="fps">FPS: \${fps} </div>
</div>`;
await UI.create(document.body, model, template).attached;
PS.createEmitter();
let myNow: number;

Engine.create({
  fps: 60,
  started: true,
  callback: (deltaTime: number, now: number) => {
    //console.log(myNow, now);

    if (myNow == undefined) myNow = now;
    //model.fps = (1000 / deltaTime).toFixed(2);
    model.fps = (1000 / (now - myNow)).toFixed(2);
    PS.update(deltaTime, now);
    myNow = now;
  },
});
