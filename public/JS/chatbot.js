document.addEventListener('DOMContentLoaded', function () {
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');

  chatToggle.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
  });

  window.handleChat = function () {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    chatMessages.innerHTML += `<div><strong>You:</strong> ${text}</div>`;

    let reply = "Sorry, I didn't understand that. Try asking about 'return', 'stock', 'register', or 'authors'.";
    if (/return.*book/i.test(text)) {
      reply = 'You can return a book by visiting the <a href="return.html">Return Book</a> page.';
    } else if (/author|find.*author/i.test(text)) {
      reply = 'Use our <a href="book_search.html">Book Search</a> to find authors.';
    } else if (/stock|availability/i.test(text)) {
      reply = 'Visit the <a href="management.html">Inventory Management</a> page to check book stock.';
    } else if (/register/i.test(text)) {
      reply = 'To register, go to the <a href="register.html">Registration Page</a>.';
    }

    chatMessages.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
});
