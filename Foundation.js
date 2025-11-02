/**
 * Foundation: Low-level DOM manipulation and animation utilities.
 * Handles character-by-character animations, line rendering, and visual effects.
 */
export class Foundation {
    constructor(selectors) {
        this.output = document.querySelector(selectors.output);
        this.terminal = document.querySelector(selectors.terminal);
        this.input = document.querySelector(selectors.input);
        this.dollarsymbol = document.querySelector(selectors.dollarsymbol);
    }

    /**
     * Write a single character with animation support.
     * @param {HTMLElement} parent - Parent element to append to
     * @param {string} ch - Character to write
     * @param {number} index - Character index for animation delay
     * @param {Object} opts - Options: { baseDelay, className }
     * @returns {HTMLElement|null} The created span or null for newlines
     */
    writeChar(parent, ch, index = 0, opts = {}) {
        if (ch === '\n') {
            parent.appendChild(document.createElement('br'));
            return null;
        }
        const span = document.createElement('span');
        span.className = 'char';
        if (opts.className) span.classList.add(opts.className);
        span.textContent = ch;
        span.style.setProperty('--i', String(index));
        const baseDelay = opts.baseDelay ?? 0.02;
        if (typeof baseDelay === 'number') {
            span.style.setProperty('animation-delay', `calc(var(--i, 0) * ${baseDelay}s)`);
        }
        parent.appendChild(span);
        return span;
    }

    /**
     * Write a complete line to the terminal output.
     * @param {string|Object} textOrObj - Text or { text, className }
     * @param {boolean} animate - Whether to animate per-character
     * @param {Object} opts - Options: { baseDelay, className }
     * @returns {HTMLElement} The created line element
     */
    writeLine(textOrObj, animate = true, opts = {}) {
        const line = document.createElement('div');
        line.className = 'line cmd-echo';

        let text = textOrObj;
        if (typeof textOrObj === 'object' && textOrObj !== null) {
            text = textOrObj.text ?? '';
            if (textOrObj.className) opts = Object.assign({}, opts, { className: textOrObj.className });
        }

        if (!animate) {
            line.textContent = text;
            if (opts.className) line.classList.add(opts.className);
            this.output.appendChild(line);
            this.scrollToBottom();
            return line;
        }

        const wrapper = document.createElement('span');
        wrapper.className = 'typewriter';
        if (opts.className) wrapper.classList.add(opts.className);

        let charIndex = 0;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '\n') {
                wrapper.appendChild(document.createElement('br'));
                continue;
            }
            this.writeChar(wrapper, ch, charIndex, opts);
            charIndex++;
        }

        line.appendChild(wrapper);
        this.output.appendChild(line);
        this.scrollToBottom();
        return line;
    }

    /**
     * Animate text into a parent element with typewriter effect.
     * @param {HTMLElement} parent - Parent element
     * @param {string} text - Text to animate
     * @param {Object} opts - Options: { baseDelay, className, cursor }
     * @returns {Promise} Resolves when animation completes
     */
    animateText(parent, text, opts = {}) {
        const baseDelay = typeof opts.baseDelay === 'number' ? opts.baseDelay : 0.02;
        const className = opts.className;
        const showCursor = !!opts.cursor;

        parent.textContent = '';
        const wrapper = document.createElement('span');
        wrapper.className = 'typewriter';
        if (className) wrapper.classList.add(className);

        let charIndex = 0;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '\n') {
                wrapper.appendChild(document.createElement('br'));
                continue;
            }
            this.writeChar(wrapper, ch, charIndex, { baseDelay });
            charIndex++;
        }

        if (showCursor) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            wrapper.appendChild(cursor);
        }

        parent.appendChild(wrapper);

        const animDurationMs = 420;
        const totalMs = Math.max(0, (charIndex - 1) * baseDelay * 1000 + animDurationMs);

        return new Promise((resolve) => {
            setTimeout(() => {
                if (showCursor) {
                    const c = wrapper.querySelector('.cursor');
                    if (c) c.remove();
                }
                resolve();
            }, totalMs);
        });
    }

    /**
     * Scroll terminal to bottom.
     */
    scrollToBottom() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    /**
     * Clear all terminal output.
     */
    clearOutput() {
        this.output.innerHTML = '';
        this.terminal.scrollTop = 0;
    }

    /**
     * Show the dollar sign prompt.
     */
    showPrompt() {
        this.dollarsymbol.style.display = 'inline-block';
    }

    /**
     * Hide the dollar sign prompt.
     */
    hidePrompt() {
        this.dollarsymbol.style.display = 'none';
    }

    /**
     * Focus the input field.
     */
    focusInput() {
        this.input.focus();
    }
}