import { InterfaceRegistry, Specs, fileURLToPath, join } from '../registry.mjs';
export { Dog } from './classes/dog.mjs';
export { Food } from './classes/food.mjs';
const baseUrl = import.meta.url;
const currentDir = fileURLToPath(new URL('./', baseUrl));
InterfaceRegistry.load(join(currentDir, 'classes'));
const specs = new Specs(10000, './specs');
specs.run();