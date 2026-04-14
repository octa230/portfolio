//chat-store.js

const ChatStore = (() => {
  let state = {
    messages: [],
    loading: false,
    streaming: false,
    abortController: null,
  };

  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(partial) {
    state = { ...state, ...partial };
    listeners.forEach(fn => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { getState, setState, subscribe };
})();

export default ChatStore;