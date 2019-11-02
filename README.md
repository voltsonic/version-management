# Version Manager

To install from npm:
```
npm i --save version-management
```

Save the following somewhere (preferably not project root directory) 

following example: `[project]/developer/scripts/version.js`

changelog location: `[project]/developer/documentation/CHANGELOG.md`

dotenv file: `[project]/.env` with `APP_VERSION=1.0.0` as an env variable in there. 
```javascript
"use strict";

// Usage: node ./version.js -abcf
// -a = bump major by 1
// -b = bump minor by 1
// -c = bump patch by 1
// -f = set to specific version.

const VersionManager        = require("version-manager"),
    ComposerTemplateModule  = require("version-manager/Templates/Modules/PHP/ComposerTemplateModule"),
    NodeTemplateModule      = require("version-manager/Templates/Modules/NodeJS/NodeTemplateModule"),
    DeveloperTemplateModule = require("version-manager/Templates/Modules/DeveloperTemplateModule");

// This is based on version.js being at `[project]/developer/scripts/`
const projectRoot = require("path").join(__dirname, '..', '..'); 

// Bumps file
let Version = new VersionManager.VersionProgram(__filename+'on');

// Run Templates
VersionManager
    .VersionTemplates
    .addTemplate(ComposerTemplateModule.standard(projectRoot))
    .addTemplate(NodeTemplateModule.standard(projectRoot))
    .addTemplate(DeveloperTemplateModule.dotenv(projectRoot))
    .addTemplate(DeveloperTemplateModule.changelog_hotfixUrls_NodePackage(projectRoot, 'developer/documentation/CHANGELOG.md'))
    .runTemplate(Version.getUpdated());
```

### Running

- Force version: `node developer/scripts/version -f 1.0.0` becomes 1.0.0
- Bump major by 1: `node developer/scripts/version -a` 1.0.0 => 2.0.0
- Bump minor by 2: `node developer/scripts/version -a` 2.0.0 => 2.2.0
- Bump patch by 3: `node developer/scripts/version -a` 2.2.0 => 2.2.3
- Unique bump: `node developer/scripts/version -abbbcc` 2.2.3 => 3.3.2

Once version changes the configured templates will be ran using the updated value.