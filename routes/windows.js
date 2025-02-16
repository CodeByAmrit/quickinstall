const express = require("express");
const win_route = express.Router();
const { exec } = require("child_process");

function parseWingetOutput(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line);

    // Ignore the first line as it contains column headers
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(/\s{2,}/); // Split by 2+ spaces

        if (parts.length >= 4) {
            results.push({
                name: parts[0],         // Software Name
                id: parts[1],           // Package ID
                version: parts[2],      // Version
                source: parts[3]        // Source (winget/msstore)
            });
        }
    }
    return results;
}

win_route.post("/search", (req, res) => {
    const { search_value } = req.body;

    try {
        exec(`winget search ${search_value}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stderr}`);
                return res.status(500).send('Deployment failed');
            }
            console.log(`Deployment output: ${stdout}`);
            res.status(200).send(JSON.stringify({ result: parseWingetOutput(stdout)}));
        });
    } catch (error) {
        console.log(error);
    }

})

win_route.post("/search/all", (req, res) => {

    try {
        exec(`winget search > available_software.txt`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stderr}`);
                return res.status(500).send('Deployment failed');
            }
            console.log(`Deployment output: ${stdout}`);
            res.status(200).send(JSON.stringify({ result: stdout }));
        });
    } catch (error) {
        console.log(error);
    }

})

module.exports = { win_route }