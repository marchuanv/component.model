import { 
    Jasmine,
    url
} from "../registry.mjs";
const projectBaseDir = url.fileURLToPath(new URL('./', import.meta.url));
const jasmine = new Jasmine({ projectBaseDir });
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
jasmine.addMatchingSpecFiles(['**/*.spec.mjs']);
jasmine.execute();