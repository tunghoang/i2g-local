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
        await execShellCommand(`rm -fr output`);
        await execShellCommand(`ssh kubectl "rm -fr /tmp/i2g-local/*"`);
        await execShellCommand(`mkdir output`);
        await Promise.all(repos.map(async repo => {
            if (repo.name === "wi-angular") {
                if (["wi-angular", "wi-python-frontend", "base-map"].includes(repo.name)) {
                    if (repo.name === "base-map") {
                        await execShellCommand(`git clone ${repo.url}`, {cwd: "./output"});
                        await execShellCommand(`git checkout -b local-service`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`git pull origin local-service`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`git merge master`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`cp build-image.sh ../output/${repo.name}`, {cwd: "./src"});
                        await execShellCommand(`npm i`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`bower install`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`bower update`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`npm run local`, {cwd: `./output/${repo.name}`});
                    }
                    if (repo.name === "wi-angular") {
                        await execShellCommand(`git clone ${repo.url}`, {cwd: "./output"});
                        await execShellCommand(`git checkout master-r2`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`git checkout -b local-service`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`git pull origin local-service`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`git merge master-r2`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`cp build-image.sh ../output/${repo.name}`, {cwd: "./src"});
                        await execShellCommand(`npm i`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`bower install`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`bower update`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`gulp clean`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`gulp pre`, {cwd: `./output/${repo.name}`});
                        await execShellCommand(`NODE_ENV=local gulp build`, {cwd: `./output/${repo.name}`});
                    }
                } else {
                    await execShellCommand(`git clone ${repo.url}`, {cwd: "./output"});
                    await execShellCommand(`git checkout -b local-service`, {cwd: `./output/${repo.name}`});
                    await execShellCommand(`git pull origin local-service`, {cwd: `./output/${repo.name}`});
                    await execShellCommand(`git merge master`, {cwd: `./output/${repo.name}`});
                    await execShellCommand(`cp build-image.sh ../output/${repo.name}`, {cwd: "./src"});
                }
                await execShellCommand(`rsync --delete -azvv ./${repo.name} --rsync-path="rsync" kubectl:/tmp/i2g-local/`, {cwd: "./output"});
                await execShellCommand(`ssh kubectl "cd /tmp/i2g-local/${repo.name} && /bin/bash build-image.sh ${REGISTRY_URL}/${repo.name}:local"`, {cwd: `./output/${repo.name}`});
                // await execShellCommand(`rm -fr ${repo.name}`, {cwd: `./output`});
            }
        }));
        // await execShellCommand(`rm -fr output`);
        // await execShellCommand(`ssh kubectl "rm -fr /tmp/i2g-local/*"`);
    } catch (e) {
        console.error(e);
    }
};

run();
