document.getElementById('send-button').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    addMessage('User', userInput);
    document.getElementById('user-input').value = '';

    // Show typing indicator for the bot
    showTypingIndicator();

    try {
        const response = await fetch(`/ask?message=${encodeURIComponent(userInput)}`);
        const data = await response.json();

        // Remove typing indicator before displaying the response
        hideTypingIndicator();

        if (data?.response) {
            addMessage('Ririee', data.response);
        } else {
            const errorMessage = data.error ? `Error: ${data.error}` : 'Maaf, terjadi kesalahan.';
            addMessage('Ririee', errorMessage, 'error');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage('Ririee', 'Error: Tidak bisa terhubung ke server.', 'error');
    }
});

function addMessage(sender, message, type = 'default') {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'User' ? 'user-message' : 'bot-message');
    if (type === 'error') messageDiv.classList.add('error-message');

    // Define the code block pattern
    const codeBlockPattern = /```(.*?)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockPattern.exec(message)) !== null) {
        const textBeforeCode = message.substring(lastIndex, match.index);
        if (textBeforeCode) {
            formatTextBlocks(messageDiv, textBeforeCode, sender);
        }

        const language = match[1].trim();
        const code = match[2].trim();
        createCodeBlock(messageDiv, code, language);

        lastIndex = codeBlockPattern.lastIndex;
    }

    // Add any remaining text after the last code block
    const remainingText = message.substring(lastIndex);
    if (remainingText) {
        formatTextBlocks(messageDiv, remainingText, sender);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function formatTextBlocks(parentDiv, text, sender) {
    const paragraphs = text.split(/\n\s*\n|(\d+\.\s)|(?=\*\*)/g);

    paragraphs.forEach((paragraph) => {
        if (!paragraph) return; // Skip empty lines

        const trimmedText = paragraph.trim();

        if (trimmedText.match(/^\d+\.\s/)) {
            // Numbered list item, bold only the number and the first word
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${escapeHTML(trimmedText.split(' ')[0])}</strong> ${escapeHTML(trimmedText.substring(trimmedText.indexOf(' ') + 1))}`;
            let list = parentDiv.querySelector('ol') || document.createElement('ol');
            list.appendChild(listItem);
            if (!parentDiv.contains(list)) parentDiv.appendChild(list);
        }
         else if (trimmedText.startsWith('**')) {
            // Handle headings (bold only the first part of the heading)
            const headingText = trimmedText.replace(/\*\*/g, '').trim();
            const firstWordEndIndex = headingText.indexOf(' ') > 0 ? headingText.indexOf(' ') : headingText.length;
            const firstWord = headingText.substring(0, firstWordEndIndex);
            const remainingText = headingText.substring(firstWordEndIndex);

            const headingDiv = document.createElement('h4');
            headingDiv.innerHTML = `<strong>${escapeHTML(firstWord)}</strong>${escapeHTML(remainingText)}`;
            parentDiv.appendChild(headingDiv);
        } else {
            // Regular paragraph (normal text without bold)
            const textDiv = document.createElement('div');
            textDiv.innerHTML = `${escapeHTML(trimmedText)}`;
            parentDiv.appendChild(textDiv);
        }
    });
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('bot-message');
    typingDiv.innerHTML = '<em>Ririee is typing...</em>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

function escapeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

function createCodeBlock(parentDiv, code, language) {
    const codeContainer = document.createElement('div');
    codeContainer.classList.add('code-container');

    const codeBlock = document.createElement('pre');
    codeBlock.classList.add('code-block');
    const codeElement = document.createElement('code');
    codeElement.innerHTML = escapeHTML(code);

    codeBlock.appendChild(codeElement);

    const copyButton = document.createElement('button');
    copyButton.innerText = `Copy ${language} Code`;
    copyButton.classList.add('copy-button');

    copyButton.addEventListener('click', () => {
        copyToClipboard(code);
        copyButton.innerText = 'Copied!';
        setTimeout(() => (copyButton.innerText = `Copy ${language} Code`), 2000);
    });

    codeContainer.appendChild(copyButton);
    codeContainer.appendChild(codeBlock);
    parentDiv.appendChild(codeContainer);
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}
