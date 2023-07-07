import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Assets } from "@peasy-lib/peasy-assets";
import { Input } from "@peasy-lib/peasy-input";
const model = {};
const template = `<div> Hello Peasy!!! 

</div>`;
await UI.create(document.body, model, template).attached;
console.log(`Hello World`);
