"use strict";

const fs = require('fs');
const SemVer = require('semver');

let bumpMore = function(v, total){ return total + 1; };

class VersionProgram {
    __buildProgram(args){
        this.program = require('commander');
        this.program
            .version('1.0.0')
            .option('-a, --bump-major', 'Bump Major (1.x.x)', bumpMore, 0)
            .option('-b, --bump-minor', 'Bump Minor (x.1.x', bumpMore, 0)
            .option('-c, --bump-patch', 'Bump Patch (x.x.1)', bumpMore, 0)
            .option('-f, --force-version [force_version]', 'Force Version')
            .parse(args);
    }
    __initVersionFile(){
        if(!fs.existsSync(this.bumpFile)){
            fs.writeFileSync(this.bumpFile, JSON.stringify({
                dots: '0.0.1',
                dash: '0-0-1',
                underscore: '0_0_1',
            }), 'utf8');
        }
    }
    __verifyVersionFile(){
        this.configCurrent = require(this.bumpFile);

        if(!this.configCurrent || !this.configCurrent.dots){
            console.error('Failed Configuration File: '+this.bumpFile);
            process.exit(1);
        }
    }

    constructor(
        bumpFile,
        args = false
    ){
        if(!args) args = process.argv;
        this.bumpFile = bumpFile;
        this.__buildProgram(args);
        this.__initVersionFile();
        this.__verifyVersionFile();

        let versionNow;
        let bumpsChanged = false;

        if(this.program.forceVersion){
            if(this.program.forceVersion.match(/^[0-9]+\.[0-9]+\.[0-9]+$/i)){
                bumpsChanged = true;
                versionNow = {
                    dots: this.program.forceVersion
                };
            }else{
                console.log("Force bump failed check for #.#.# (where # = number)");
                process.exit(1);
            }
        }else{
            let bumps = {
                major: this.program.bumpMajor?this.program.bumpMajor:0,
                minor: this.program.bumpMinor?this.program.bumpMinor:0,
                patch: this.program.bumpPatch?this.program.bumpPatch:0
            };

            let i;

            versionNow = new SemVer(this.configCurrent.dots);

            if(bumps.major > 0 && (bumpsChanged = true)) for(i=0;i<bumps.major;i++) versionNow.inc('major');
            if(bumps.minor > 0 && (bumpsChanged = true)) for(i=0;i<bumps.minor;i++) versionNow.inc('minor');
            if(bumps.patch > 0 && (bumpsChanged = true)) for(i=0;i<bumps.patch;i++) versionNow.inc('patch');

            versionNow = {
                dots: versionNow.toString()
            };
        }

        this.configCurrent.dots = versionNow.dots;

        if(bumpsChanged){
            this.configCurrent.dash = this.configCurrent.dots.replace(/\./gi, '-');
            this.configCurrent.underscore = this.configCurrent.dots.replace(/\./gi, '_');
            fs.writeFileSync(this.bumpFile, JSON.stringify(this.configCurrent), 'utf8');
            console.log('+ Version Bumps Updated [v'+this.configCurrent.dots+']');
        }
    }

    getUpdated(){
        return this.configCurrent;
    }
}

module.exports = VersionProgram;
