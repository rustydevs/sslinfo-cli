const chalk = require('chalk');
const log = console.log;
const _ = require('lodash');

const error = chalk.bold.red;
const header = chalk.bold.bgBlueBright;
const content = chalk.bold.blueBright;
const warning = chalk.keyword('orange');



module.exports = (function() {
    function printCertDetails(results) {
        if (results.cert) {
            // Nest styles of the same type even (color, underline, background)
            log(chalk.whiteBright(
                chalk.whiteBright.bold('Alternate Names: ') +
                chalk.white(results.cert.altNames.join(', '))
            ));
        }
    }
    
    function printProcolols(results) {
        if (results.protocols) {
            var data = [];
            _.forEach(results.protocols, protocol => {
                // log(content("%s\t%s"), (protocol.enabled ? 'Y':'N'), protocol.name );
                data.push([(protocol.enabled ? 'Y':'N'), protocol.name ]);
            });
            let Table = require('tty-table');
            var protocolTable = new Table(
                [
                    {
                        value: 'Enabled',
                        color: "white",
                        width : 10
                    },
                    {
                        value: 'Protocol',
                        width : 50
                    }
                ],
                data,
                {compact : true}
            );
            log(content(protocolTable.render()));
        }
    }
    
    function printCiphers(results) {
        if (results.ciphers) {
            var data = [];
            _.forEach(_.keys(results.ciphers), protocol => {
                var cipher = results.ciphers[protocol];
                // log(content("%s\t\t%s"), cipher.name, cipher.enabled.join(', ') );
                data.push([cipher.name , cipher.enabled.join(', ') ]);
            });
            let Table = require('tty-table');
            var cipherTable = new Table(
                [
                    {
                        value : "Protocol",
                        color: "white",
                        width : 30
                    },
                    {
                        value : "Ciphers",
                        width : 300,
                        align: 'left'
                    }
                ],
                data,
                {compact : false}
            );
            log(content(cipherTable.render()));
        }
       
    }

    return {
        process : function (host, port) {
            // log('host:', host);
            var sslinfo = require('sslinfo');
            sslinfo.getServerResults({ host: host, port: port, servername:host })
            .done(function (results) {
                // log(results);
                var fs = require('fs');
                var json = JSON.stringify(results, null, '  ');
                printCertDetails(results);
                printProcolols(results);
                printCiphers(results);
                // fs.writeFile('output.json', json, 'utf8', (err) => {
                //     if (err) {
                //         log(error("Error: %s"), err);
                //     }
                // });
            },
            function (err) {
                log(error("Error: %s"), err);
            });
        }
    };
})();