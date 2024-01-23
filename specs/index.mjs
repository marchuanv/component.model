import { Model, Specs, TypeDefinition, fileURLToPath, join } from "../registry.mjs";
import { Animal } from "./classes/animal.mjs";
import { Dog } from "./classes/dog.mjs";
import { Food } from "./classes/food.mjs";
let currentDir = fileURLToPath(new URL('./', import.meta.url));
const specClassesScriptsDirPath = join(currentDir, 'classes');
const libScriptsDirPath = join(currentDir, '../', 'lib');
TypeDefinition.register([
    { scriptsDirPath: libScriptsDirPath, scriptFileName: 'model.mjs', targetClass: Model },
    { scriptsDirPath: specClassesScriptsDirPath, scriptFileName: 'animal.mjs', targetClass: Animal },
    { scriptsDirPath: specClassesScriptsDirPath, scriptFileName: 'food.mjs', targetClass: Food },
    { scriptsDirPath: specClassesScriptsDirPath, scriptFileName: 'dog.mjs', targetClass: Dog },
]).then(() => {
    const specs = new Specs(60000, './');
    specs.run();
}).catch((error) => {
    console.error(error);
});
export { Animal, Dog, Food };

