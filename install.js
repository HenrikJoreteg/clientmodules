var fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync,
    async = require('async'),
    colors = require('colors'),
    Columnizer = require('columnizer'),
    table = new Columnizer;
    pkg = JSON.parse(fs.readFileSync('package.json')),
    clientModules = pkg.clientmodules,
    copied = [],
    directory = pkg.clientmodulesDir || 'clientmodules';

function pad(string, target) {
    console.log('target - string.length', target - string.length);
    return string + (new Array((target - string.length) < 0 ? 0 : target - string.length).join(' '));
}

if (clientModules && clientModules.forEach) {
    try {
        fs.mkdirSync(directory);
    } catch (e) {}
    async.forEach(clientModules, function (item, loopCb) {
        fs.readFile('node_modules/' + item + '/package.json', function (err, text) {
            if (err) return loopCb(err);
            var parsed = JSON.parse(text),
                fileName = item + '.js',
                path = 'node_modules/' + item + '/',
                mainFile = function () {
                    var res;
                    if (existsSync(path + fileName)) {
                        return path + fileName;
                    } else if (existsSync(path + 'lib/' + fileName)) {
                        return path + 'lib/' + fileName;
                    } else if (existsSync(path + 'build/' + fileName)) {
                        return path + 'build/' + fileName;
                    } else {
                        return false;
                    }
                }();

            if (!mainFile) {
                loopCb();
                return;
            }

            writeStream = fs.createWriteStream(directory + '/' + item + '.js'),
            readStream = fs.createReadStream(mainFile);

            writeStream.once('close', function () {
                table.row('  ', (item + '.js').green, mainFile);
                loopCb()
            });

            readStream.pipe(writeStream);
        });
    }, function (err) {
        var sep = '\n    ';
        if (!err) {
            console.log('clientmodules copied the following files into the ' + directory.green + ' directory:');
            table.print();
            process.exit(0);
        } else {
            console.error(err);
            console.log('Oops... something didn\'t work');
            process.exit(1);
        }
    });
} else {
    console.log("Add a 'clientmodules' array to package.json");
    process.exit(1);
}
