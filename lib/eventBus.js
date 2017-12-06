const subscribers = [];
const history = {};

module.exports.subscribe = subscriber => {
  subscribers.push(subscriber);
};

module.exports.unsubscribe = subscriber => {
  const idx = subscribers.indexOf(subscriber);
  subscribers.splice(idx, 1);
};

module.exports.publish = (id, data) => {
  const event = { id, data, updatedAt: Date.now() };
  subscribers.forEach(subscriber => subscriber(event));

  history[id] = event;
};

module.exports.replayHistory = subscriber => {
  Object.values(history).forEach(event => subscriber(event));
};
