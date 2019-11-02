"use strict";

const VersionManager    = require("../VersionManager"),
    NodeTemplateModule  = require("../Templates/Modules/NodeJS/NodeTemplateModule");

// Run Templates
VersionManager
    .VersionTemplates
    .addTemplate(NodeTemplateModule.standard(require("path").join(__dirname, '..')))
    .runTemplate((new VersionManager.VersionProgram(__filename+'on')).getUpdated());