/**
 * JWT Decoder
 * Decodes and displays JSON Web Token components
 */
(function() {
    'use strict';

    // DOM elements
    const inputEl = document.getElementById('jwt-input');
    const decodeBtn = document.getElementById('decode-btn');
    const clearBtn = document.getElementById('clear-btn');
    const outputEl = document.getElementById('jwt-output');
    const headerEl = document.getElementById('jwt-header');
    const payloadEl = document.getElementById('jwt-payload');
    const signatureEl = document.getElementById('jwt-signature');
    const errorEl = document.getElementById('jwt-error');

    /**
     * Decode a base64url encoded string
     */
    function base64UrlDecode(str) {
        // Replace base64url characters with base64 characters
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

        // Pad with = if needed
        const padding = base64.length % 4;
        if (padding) {
            base64 += '='.repeat(4 - padding);
        }

        // Decode
        const decoded = atob(base64);

        // Handle UTF-8
        return decodeURIComponent(
            decoded.split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
    }

    /**
     * Format a Unix timestamp as a readable date
     */
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    /**
     * Check if a value looks like a Unix timestamp
     */
    function isTimestamp(key, value) {
        const timestampClaims = ['exp', 'iat', 'nbf', 'auth_time'];
        return timestampClaims.includes(key) &&
               typeof value === 'number' &&
               value > 1000000000 &&
               value < 10000000000;
    }

    /**
     * Format JSON with syntax highlighting and timestamp conversion
     */
    function formatJson(obj) {
        const lines = [];

        lines.push('{');

        const keys = Object.keys(obj);
        keys.forEach(function(key, index) {
            const value = obj[key];
            const isLast = index === keys.length - 1;
            const comma = isLast ? '' : ',';

            let valueStr;
            let valueClass = 'jwt-claim-value';

            if (typeof value === 'string') {
                valueStr = '"' + escapeHtml(value) + '"';
                valueClass += ' string';
            } else if (typeof value === 'number') {
                valueStr = String(value);
                valueClass += ' number';
            } else if (typeof value === 'boolean') {
                valueStr = String(value);
                valueClass += ' boolean';
            } else if (value === null) {
                valueStr = 'null';
                valueClass += ' null';
            } else {
                valueStr = JSON.stringify(value);
            }

            let timestampNote = '';
            if (isTimestamp(key, value)) {
                timestampNote = '<span class="jwt-timestamp">// ' +
                               formatTimestamp(value) + '</span>';
            }

            lines.push(
                '  <span class="jwt-claim">' +
                '<span class="jwt-claim-key">"' + escapeHtml(key) + '"</span>: ' +
                '<span class="' + valueClass + '">' + valueStr + '</span>' +
                comma + timestampNote +
                '</span>'
            );
        });

        lines.push('}');

        return lines.join('\n');
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Decode the JWT
     */
    function decode() {
        const jwt = inputEl.value.trim();

        if (!jwt) {
            showError('Please paste a JWT to decode');
            return;
        }

        // Split into parts
        const parts = jwt.split('.');

        if (parts.length !== 3) {
            showError('Invalid JWT format. A JWT should have 3 parts separated by dots.');
            return;
        }

        try {
            // Decode header
            const headerJson = base64UrlDecode(parts[0]);
            const header = JSON.parse(headerJson);
            headerEl.innerHTML = formatJson(header);

            // Decode payload
            const payloadJson = base64UrlDecode(parts[1]);
            const payload = JSON.parse(payloadJson);
            payloadEl.innerHTML = formatJson(payload);

            // Show signature (base64url encoded)
            signatureEl.textContent = parts[2];

            // Show output, hide error
            outputEl.classList.add('active');
            errorEl.style.display = 'none';

        } catch (error) {
            showError('Failed to decode JWT: ' + error.message);
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        outputEl.classList.remove('active');
    }

    /**
     * Clear all inputs and outputs
     */
    function clear() {
        inputEl.value = '';
        headerEl.textContent = '';
        payloadEl.textContent = '';
        signatureEl.textContent = '';
        outputEl.classList.remove('active');
        errorEl.style.display = 'none';
    }

    // Event listeners
    decodeBtn.addEventListener('click', decode);
    clearBtn.addEventListener('click', clear);

    // Auto-decode on paste
    inputEl.addEventListener('paste', function() {
        setTimeout(decode, 0);
    });

    // Keyboard shortcut: Ctrl+Enter to decode
    inputEl.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            decode();
        }
    });
})();
