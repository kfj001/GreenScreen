/**
 * Application entry point.
 * Initializes Foundation (presentation) and Terminus (terminal logic).
 */
import { Foundation } from './Foundation.js';
import { Terminus } from './Terminus.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Foundation with DOM selectors
    const foundation = new Foundation({
        input: '.input_area',
        output: '.output',
        terminal: '.terminal',
        dollarsymbol: '.dollarsymbol',
    });

    // Initialize Terminus with Foundation
    const terminus = new Terminus(foundation);

    // Start the REPL
    terminus.startREPL();
});