import { Container, Specs, fileURLToPath, join } from '../registry.mjs';
import { Dog } from './classes/dog.mjs';
import { Food } from './classes/food.mjs';
const currentDir = fileURLToPath(new URL('./', import.meta.url));
Container.register(join(currentDir, 'classes', 'food.interface.json'), Food);
Container.register(join(currentDir, 'classes', 'dog.interface.json'), Dog);
export { Dog, Food };
const specs = new Specs(10000, './specs');
specs.run();