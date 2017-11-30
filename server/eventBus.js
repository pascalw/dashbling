const subscribers = [];

module.exports.subscribe = subscriber => {
  subscribers.push(subscriber);
};

module.exports.unsubscribe = subscriber => {
  const idx = subscribers.indexOf(subscriber);
  subscribers.splice(idx, 1);
};

module.exports.publish = (id, data) => {
  const eventData = { id, data, updatedAt: new Date().getTime() };
  subscribers.forEach(subscriber => subscriber(eventData));
};
