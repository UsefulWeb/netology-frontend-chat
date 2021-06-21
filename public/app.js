!(() => {
  let lastMessageId = -1;
  document.addEventListener('submit', e => {
    const chatForm = e.target.closest('.chat-form');
    if (!chatForm) {
      return;
    }
    if (!chatForm.checkValidity()) {
      return;
    }
    e.preventDefault();

    const chat = chatForm.closest('.chat');
    const messageInput = chatForm.elements.message;
    const message = messageInput.value;
    const messageContainer = chat.querySelector('.chat__messages');

    renderMessage({
      username: getUserName(),
      isMyMessage: true,
      message,
      container: messageContainer
    });

    sendMessage({
      username: getUserName(),
      message,
    });

    chatForm.reset();
    messageInput.focus();
  });

  const listMessages = async () => {
    const url = '/?action=list-messages';
    const response = await fetch(url);
    const { data } = await response.json();
    return data;
  };

  const getUpdates = async () => {
    const url = `/?action=new-messages&last_update=${lastMessageId}`;
    const response = await fetch(url);
    const { data } = await response.json();
    return data;
  };

  const sendMessage = async options => {
    const { message, username } = options;
    const url = '/?action=create-message';
    const formData = new FormData;
    formData.append('message', message);
    formData.append('username', username);
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const { id } = await response.json();

    lastMessageId = id;
  };

  const getRandomString = () => Math.random().toString(36).substr(2);

  const getUserName = () => {
    const { username } = localStorage;
    if (!username) {
      const username = 'user-' + getRandomString();
      localStorage.username = username;

      return username;
    }
    return username;
  };

  const createElement = (element, options = {}) => Object.assign(
    document.createElement(element),
    options
  );

  const renderMessage = options => {
    const {
      message,
      container,
    } = options;
    const isMyMessage = options.username === getUserName();
    const username = isMyMessage ? 'Вы' : options.username;

    const messageClassName = isMyMessage ? 'chat-message chat-message_my': 'chat-message chat-message_user';
    const node = createElement('div', {
      className: messageClassName
    });
    const userNode = createElement('div', {
      className: 'chat-message__user',
      textContent: username
    });
    const textNode = createElement('div', {
      className: 'chat-message__text',
      textContent: message
    });

    node.appendChild(userNode);
    node.appendChild(textNode);

    container.appendChild(node);
  };

  const initUpdates = () => {
    const container = document.querySelector('.chat__messages');

    setInterval(async () => {
      const messages = await getUpdates();

      renderUpdates({
        messages,
        container
      });
    }, 5000);
  };

  const renderUpdates = options => {
    const { messages, container } = options;
    messages.forEach(item => {
      renderMessage({
        ...item,
        container
      })
    });

    if (messages.length === 0) {
      return;
    }
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }
    lastMessageId = lastMessage.id;
  };

  const onload = callback => {
    if (document.readyState !== 'loading') {
      return callback();
    }
    document.addEventListener('DOMContentLoaded', callback);
  };

  onload(async () => {
    const container = document.querySelector('.chat__messages');
    if (!container) {
      return;
    }
    const messages = await listMessages();

    renderUpdates({
      messages,
      container
    });

    initUpdates();
  });
})();
