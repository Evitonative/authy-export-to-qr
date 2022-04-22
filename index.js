'use strict';
var QRCode = require('qrcode');
var readlineSync = require('readline-sync');
var fs = require('fs');
const {
    Console
} = require('console');

(function main() {
    var hasWorkingFile = false;
    var data;
    do {
        console.log('Generate totp QR-Codes');
        var filename = readlineSync.question('What is the Name of the json file you open?\n> ');

        if (!filename.endsWith('.json')) filename = filename + '.json';
        try {
            let rawdata = fs.readFileSync(filename);
            data = JSON.parse(rawdata);
            console.log(data);
        } catch (e) {
            console.clear();
            console.error('Failed to open the requested file', filename);
            console.error('Please try again...');
            continue;
        }

        if (!readlineSync.keyInYN('Is this data correct?')) {
            console.clear();
            console.error('Please try again...');
        } else hasWorkingFile = true;
    } while (!hasWorkingFile);

    console.log('We will going through each key in the config file. [Press Enter to continue]');
    readlineSync.question();

    for (let i = 0; i < data.length; i++) {
        const e = data[i];

        console.log(e.name + ':')
        QRCode.toString(e.uri, {
            type: 'terminal'
        }, function (err, url) {
            console.log(url);
        })

        if(i != 0)
            if(readlineSync.question('Press enter to go to next (' + data[i+1].name + ') or go back to "' + data[i-1].name + '" by typing "back".\n') === 'back') i = i-2; else;
        else readlineSync.question('Press enter to go to next (' + data[i+1].name + ')\n');
        console.clear();
    }
})();

/**/