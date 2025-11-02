/**
 * Terminus: Terminal simulation logic.
 * Handles command execution, REPL loop, and terminal state management.
 */
export class Terminus {
    constructor(foundation) {
        this.foundation = foundation;
        this.isPromptActive = true;
        this.pendingReadResolve = null;
        this.scramblyInterval = null;
        this.commandRegistry = this._buildCommandRegistry();

        this._setupInputHandlers();
    }

    /**
     * Set up input event handlers.
     * @private
     */
    _setupInputHandlers() {
        const input = this.foundation.input;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = input.value;
                input.value = '';
                this.isPromptActive = true;
                if (this.pendingReadResolve) {
                    this.pendingReadResolve(val);
                }
            }
        });
    }

    /**
     * Build the command registry with available commands.
     * @private
     */
    _buildCommandRegistry() {
        return {
            ls: () => this._doLs(),
            clear: () => this._doClear(),
            scramblybugs: () => this._doScramblybugs(),
            test: () => this._doTest(),
            hide: () => this._doHide(),
        };
    }

    /**
     * Read a line of input from the user.
     * @returns {Promise<string>} User input
     */
    readLine() {
        return new Promise((resolve) => {
            this.pendingReadResolve = (val) => {
                this.pendingReadResolve = null;
                resolve(val);
            };
            this.foundation.focusInput();
        });
    }

    /**
     * Execute a command.
     * @param {string} cmd - Command string
     */
    async executeCommand(cmd) {
        if (cmd.trim() === '') return;

        const promptText = this.foundation.dollarsymbol.textContent || '$ ';

        // Echo the command with animation
        const line = document.createElement('div');
        line.className = 'line';
        const cmdContainer = document.createElement('span');
        cmdContainer.style.whiteSpace = 'pre';
        line.appendChild(cmdContainer);
        this.foundation.output.appendChild(line);

        try {
            await this.foundation.animateText(cmdContainer, cmd, { baseDelay: 0.01, cursor: true });
        } catch (e) {
            cmdContainer.textContent = cmd;
            console.error('animateText failed:', e);
        }

        // Parse and execute command
        const [cmdName, ...args] = cmd.trim().split(/\s+/);
        const commandFn = this.commandRegistry[cmdName];

        if (commandFn) {
            await commandFn(args);
        } else {
            this.foundation.writeLine({ text: `${cmd} not recognized`, className: 'error' });
        }

        this.foundation.scrollToBottom();
        if (this.isPromptActive) this.foundation.focusInput();
    }

    /**
     * Start the REPL (Read-Eval-Print Loop).
     */
    async startREPL() {
        while (true) {
            this.foundation.showPrompt();
            const line = await this.readLine();

            if (line === undefined || line === null || line.trim() === '') {
                continue;
            }

            this.foundation.hidePrompt();
            await this.executeCommand(line);
        }
    }

    // Command implementations
    async _doLs() {
        this.foundation.writeLine('file1.txt\u00A0\u00A0notes.md\u00A0\u00A0script.sh', false, {
            baseDelay: 1,
        });
    }

    async _doClear() {
        this.foundation.clearOutput();
    }

    async _doScramblybugs() {
        this.foundation.writeLine({ text: 'scramblybugs started', className: 'info' }, true, {});
        this.scramblyInterval = setInterval(() => {
            const n = Math.floor(Math.random() * 1_000_000_000);
            this.foundation.writeLine(String(n), false, {});
        }, 100);
    }

    async _doTest() {
        this.foundation.writeLine("This is a test line.");
        let line;
        do {
            line = await this.readLine();
            this.foundation.writeLine(line);
        } while (line !== 'exit');
    }

    async _doHide() {
        this.foundation.hidePrompt();
    }
}