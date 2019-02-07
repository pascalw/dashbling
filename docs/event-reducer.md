# Using an Event Reducer

By default, Dashbling keeps track of the last event data per event type. For advanced use cases you can customize this behaviour by providing an `EventReducer`.

An `EventReducer` looks like this:

```typescript
interface Reducer {
  (eventId: string, previousState: any | undefined, eventData: any): any;
}
```

Event data that flows into Dashbling, either from jobs or from data pushed in via the REST API, is passed to the reducer allow it to modify the data before it gets stored in the history and pushed to clients.

An `EventReducer` is a function that takes an `eventId`, the previous state that was stored for this event (or `null` if it's the first time an event is triggered) and the `eventData` that's coming in. The default implementation simply returns the new data like this:

```javascript
const defaultReducer = (_eventId, _previousState, eventData) => {
  return eventData;
};
```

You can create a custom reducer in case you want to override this behaviour.

For example say you have events with the following data:

```javascript
const event = {
  name: "Alice"
};
```

And you want to aggregate all events, you might define a reducer like this:

```javascript
eventReducer: (id, eventState = {}, event) => {
    switch (id) {
      case "hello":
        if (eventState.names) {
          // existing state, append the incoming name to the list of names.
          return { names: [...eventState.names, event.name] };
        } else {
          // existing state doesn't match our expectation, create a new state.
          return { names: [event.name] };
        }
      default:
        return event;
    }
  }
```

This means that the following data will be stored for the `hello` event:

```json
{
    "names": ["Alice", "Bob", "John"]
}
```
