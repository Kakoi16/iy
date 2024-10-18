document.getElementById('send-button').addEventListener('click', async function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput === '') return;

    addMessage('User', userInput);
    document.getElementById('user-input').value = '';

    try {
        const response = await fetch(`/ask?message=${encodeURIComponent(userInput)}`);
        const data = await response.json();
        
        if (data && data.response) {
            addMessage('Ririee', data.response);
        } else if (data.error) {
            addMessage('Ririee', `Error: ${data.error}`);
        } else {
            addMessage('Ririee', 'Maaf, terjadi kesalahan.');
        }
    } catch (error) {
        addMessage('Ririee', 'Error: Tidak bisa terhubung ke server.');
    }
});

function addMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
