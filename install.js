var fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync,
    async = require('async'),
    pkg = JSON.parse(fs.readFileSync('package.json')),
    clientModules = pkg.clientmodules,
    colors = require('colors'),
    Columnizer = require('columnizer'),
    table = new Columnizer,
    copied = [];

function pad(string, target) {
    return string + (new Array(target - string.length).join(' '));
}

if (clientModules && clientModules.forEach) {
    try {
        fs.mkdirSync('clientmodules');
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

            writeStream = fs.createWriteStream('clientmodules/' + item + '.js'),
            readStream = fs.createReadStream(mainFile);
            
            writeStream.once('close', function () {
                table.row('     ' + (item + '.js').green, "./" + mainFile);
                loopCb()
            });
            readStream.pipe(writeStream);
        });
    }, function (err) {
        if (!err) {
            console.log('clientmodules copied the following files into the `./clientmodules` directory:');
            table.print(5);
            process.exit(0);
        } else {
            console.log('Oops... something didn\'t work');
            process.exit(1);
        }
    });
} else {
    console.log("Add a 'clientmodules' array to package.json");
    process.exit(1);
}
