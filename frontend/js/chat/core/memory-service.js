//memory-service.js

const MemoryService = (() => {
  const LIMIT = 10;
  let history = [];

  function add(role, content) {
    history.push({ role, content });
    if (history.length > LIMIT * 2) {
      history = history.slice(-LIMIT * 2);
    }
  }

  function get() {
    return [...history];
  }

  function clear() {
    history = [];
  }

  return { add, get, clear };
})();

export default MemoryService;