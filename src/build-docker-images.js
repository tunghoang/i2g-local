const repos = require("./config").repos;
const REGISTRY_URL = "118.70.171.246:30555";

function execShellCommand(cmd, options) {
   const exec = require('child_process').exec;
   return new Promise((resolve, reject) => {
      const process = exec(cmd, options);
      process.stdout.on('data', (data) => {
         console.log(data.toString())
      });

      process.stderr.on('data', (data) => {
         console.log(data.toString())
      });

      process.on('exit', (code) => {
         resolve();
      });
   });
}

const run = async () => {
   try {
      await Promise.all(repos.map(async repo => {
         await execShellCommand(`git clone -b local-service ${repo.url}`, {cwd: "./output"});
         await execShellCommand(`cp build-image.sh ../output/${repo.name}`, {cwd: "./src"});
         await execShellCommand(`/bin/bash build-image.sh ${REGISTRY_URL}/${repo.name}:local`, {cwd: `./output/${repo.name}`});
         await execShellCommand(`rm -fr ${repo.name}`, {cwd: `./output`});
      }));
   } catch (e) {
      console.error(e);
   }
};

run();
