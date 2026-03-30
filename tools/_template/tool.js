/**
 * Tool Name
 * Description of what this tool does
 *
 * To use this template:
 * 1. Copy the _template folder to a new folder (e.g., tools/my-tool/)
 * 2. Rename this file or keep as tool.js
 * 3. Update index.html title and description
 * 4. Implement your tool logic in the process() function
 */
(function() {
    'use strict';

    // DOM elements
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');
    const processBtn = document.getElementById('process-btn');
    const clearBtn = document.getElementById('clear-btn');

    /**
     * Main processing function
     * Implement your tool logic here
     */
    function process() {
        const input = inputEl.value.trim();

        if (!input) {
            showError('Please enter some input');
            return;
        }

        try {
            // TODO: Replace with your actual tool logic
            const result = doSomething(input);
            showResult(result);
        } catch (error) {
            showError(error.message);
        }
    }

    /**
     * Your tool's core logic
     * @param {string} input - The user's input
     * @returns {*} - The processed result
     */
    function doSomething(input) {
        // Example: just return the input
        // Replace this with your actual implementation
        return {
            message: 'Tool processed successfully',
            input: input,
            length: input.length
        };
    }

    /**
     * Display successful result
     */
    function showResult(result) {
        const formatted = typeof result === 'string'
            ? result
            : JSON.stringify(result, null, 2);

        outputEl.innerHTML = '<pre>' + escapeHtml(formatted) + '</pre>';
        outputEl.classList.remove('error');
    }

    /**
     * Display error message
     */
    function showError(message) {
        outputEl.innerHTML = '<div class="tool-error">' + escapeHtml(message) + '</div>';
        outputEl.classList.add('error');
    }

    /**
     * Clear all inputs and outputs
     */
    function clear() {
        inputEl.value = '';
        outputEl.innerHTML = '';
        outputEl.classList.remove('error');
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Event listeners
    processBtn.addEventListener('click', process);
    clearBtn.addEventListener('click', clear);

    // Keyboard shortcut: Ctrl+Enter to process
    inputEl.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            process();
        }
    });
})();
