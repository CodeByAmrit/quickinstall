# Winget Installer GUI

Winget Installer GUI is a Windows desktop application built with C# and Windows Forms that provides an easy-to-use graphical interface for installing essential applications using the Windows Package Manager (`winget`).

## Features
- Install multiple applications with a single click.
- Displays real-time installation progress and logs.
- Checks if an application is already installed before attempting installation.
- Simple and user-friendly interface.

## Technologies Used
- **C#** (Windows Forms)
- **Windows Package Manager (winget)**

## Prerequisites
Before running the application, ensure that:
- You have Windows Package Manager (`winget`) installed. If not, install it from the [official Microsoft website](https://learn.microsoft.com/en-us/windows/package-manager/).
- Your system allows executing `winget` commands from the terminal.

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/codebyamrit/quickinstall.git
   ```
2. Open the project in Visual Studio.
3. Build and run the project.

## Usage
1. Launch the application.
2. Click the **Install Applications** button.
3. The application will check for already installed software and install missing ones.
4. The status and progress will be displayed in the output box.

## Applications Installed
The following applications are installed using `winget`:
- Visual Studio Code
- Node.js
- Nginx
- Google Chrome
- VLC Media Player
- Adobe Acrobat Reader
- Git
- Python 3.12
- Cloudflare WARP
- 7-Zip
- .NET SDK 9



## License
This project is licensed under the MIT License.

---

Feel free to modify and contribute! 🚀
