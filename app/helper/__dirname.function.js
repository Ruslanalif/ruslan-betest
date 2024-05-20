import { dirname } from 'path';
import { fileURLToPath } from 'url';


export default function _dirname(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl));
}
