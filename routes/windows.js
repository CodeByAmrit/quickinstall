const express = require("express");
const win_route = express.Router();
const { exec } = require("child_process");
const archiver = require("archiver");
const path = require('path');
const fs = require('fs');

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

    // Validate input to prevent command injection
    if (!search_value || /[^a-zA-Z0-9.\-_ ]/.test(search_value)) {
        return res.status(400).json({ error: "Invalid search input" });
    }

    try {
        exec(`winget search "${search_value}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${stderr}`);
                return res.status(500).json({ error: "Search failed" });
            }
            res.status(200).json({ result: parseWingetOutput(stdout) });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

win_route.post("/search/all", (req, res) => {

    try {
        exec(`winget search > available_software.txt`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stderr}`);
                return res.status(500).send('Deployment failed');
            }

            res.status(200).send(JSON.stringify({ result: stdout }));
        });
    } catch (error) {
        console.log(error);
    }

})

win_route.post("/generate", (req, res) => {
    const { selectedApps } = req.body;

    if (!Array.isArray(selectedApps) || selectedApps.length === 0) {
        return res.status(400).json({ error: "No apps selected" });
    }

    const jsonData = {
        WinGetVersion: "1.4.11071",
        CreationDate: new Date().toISOString(),
        Sources: [
            {
                Packages: selectedApps.map(app => ({
                    PackageIdentifier: app,
                    Version: "latest"
                }))
            }
        ]
    };

    const outputDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const jsonFilePath = path.join(outputDir, "apps.json");
    const scriptFilePath = path.join(outputDir, "install.bat");
    const zipFilePath = path.join(outputDir, "install_package.zip");

    // Save JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    // Create a .bat script
    const scriptContent = `@echo off
winget import -i apps.json
pause`;

    fs.writeFileSync(scriptFilePath, scriptContent);

    // Create a ZIP file containing both files
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
        res.download(zipFilePath, "install_package.zip", err => {
            if (err) console.error("Error sending file:", err);
        });
    });

    archive.on("error", err => res.status(500).json({ error: err.message }));
    archive.pipe(output);
    archive.file(jsonFilePath, { name: "apps.json" });
    archive.file(scriptFilePath, { name: "install.bat" });
    archive.finalize();
});

module.exports = { win_route }