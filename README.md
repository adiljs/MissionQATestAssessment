# MissionQATestAssessment

## Prerequisites


Before you begin, ensure you have the following installed:

### Visual Studio Code
- Download and install from [https://code.visualstudio.com/](https://code.visualstudio.com/) (available for macOS, Windows, and Linux)

### Node.js & Package Manager
- **macOS:**
	- Recommended: Install [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) and use it to install Node.js:
		```bash
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
		nvm install --lts
		```
- **Windows:**
	- Recommended: Use [nvm-windows](https://github.com/coreybutler/nvm-windows) or download Node.js directly from [https://nodejs.org/](https://nodejs.org/)
	- To use nvm-windows:
		1. Download the installer from the [releases page](https://github.com/coreybutler/nvm-windows/releases)
		2. Install and use:
			 ```powershell
			 nvm install latest
			 nvm use latest
			 ```
	- Or download and install Node.js directly from [https://nodejs.org/](https://nodejs.org/)

> **Note:** Use the Node version specified in `.nvmrc` or project documentation if available.

## Setup Instructions

1. **Clone the repository:**
	 ```bash
	 git clone <repo-url>
	 cd MissionQATestAssessment
	 ```

2. **Install dependencies:**
	 - For the API project:
		 ```bash
		 cd api
		 npm install
		 ```
	 - For the UI project:
		 ```bash
		 cd ../ui
		 npm install
		 ```

## Running Tests

Run the test scripts defined in each project's `package.json`:

- **API tests:**
	```bash
	cd api
	npm run test
	```
- **UI tests:**
	```bash
	cd ui
	npm run test
	```

## Generating Reports

After running tests, generate HTML reports using the report script in each project:

- **API report:**
	```bash
	cd api
	npm run report
	```
- **UI report:**
	```bash
	cd ui
	npm run report
	```

## Recommended VS Code Extensions

For best results, install these extensions (you will be prompted automatically if using VS Code):

- [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
