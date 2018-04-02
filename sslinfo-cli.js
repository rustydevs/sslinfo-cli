const program = require('commander');
const packageJson = require('./package');
const inquirer = require('inquirer');
const sslInfoWrapper = require('./lib/sslinfo-wrapper');


program
  .version(packageJson.version)
  .option('-h, --host [www.example.com]', 'Provide the hostname that you are looking for')
  .option('-p, --port [443]', 'Provide the port that the connection is made')
  .parse(process.argv)

  var host = program.host;
  var port = program.port || 443;
  if (!host) {
    var questions = [
        {
          type: 'input',
          name: 'host',
          message: "Provide the hostname that you are looking for?"
      },
      {
        type: 'input',
        name: 'port',
        message: "Provide the port that the connection is made?",
        default: port
    }];
    inquirer.prompt(questions).then(answers => {
        // log(JSON.stringify(answers, null, '  '));
        host = answers.host;
        port = answers.port;
        sslInfoWrapper.process(host, port);
      });
} else {
    sslInfoWrapper.process(host, port);
}