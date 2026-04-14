//chat-events.js

const ChatEvents = (() => {
  const events = {};

  function on(event, cb) {
    events[event] = events[event] || [];
    events[event].push(cb);
  }

  function emit(event, data) {
    (events[event] || []).forEach(cb => cb(data));
  }

  return { on, emit };
})();

export default ChatEvents;