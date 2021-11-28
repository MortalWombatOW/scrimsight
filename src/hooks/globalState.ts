import {useState, useEffect} from 'react';

// https://dev.to/yezyilomo/global-state-management-in-react-with-global-variables-and-hooks-state-management-doesn-t-have-to-be-so-hard-2n2c

export function GlobalState(initialValue) {
  this.value = initialValue; // Actual value of a global state
  this.subscribers = []; // List of subscribers

  this.getValue = function () {
    // Get the actual value of a global state
    return this.value;
  };

  this.setValue = function (newState) {
    // This is a method for updating a global state

    if (this.getValue() === newState) {
      // No new update
      return;
    }

    this.value = newState; // Update global state value
    this.subscribers.forEach((subscriber) => {
      // Notify subscribers that the global state has changed
      subscriber(this.value);
    });
  };

  this.subscribe = function (itemToSubscribe) {
    // This is a function for subscribing to a global state
    if (this.subscribers.indexOf(itemToSubscribe) > -1) {
      // Already subsribed
      return;
    }
    // Subscribe a component
    this.subscribers.push(itemToSubscribe);
  };

  this.unsubscribe = function (itemToUnsubscribe) {
    // This is a function for unsubscribing from a global state
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== itemToUnsubscribe,
    );
  };
}

export function useGlobalState(globalState) {
  const [, setInnerState] = useState();
  const state = globalState.getValue();

  function reRender(newState) {
    // This will be called when the global state changes
    setInnerState({});
  }

  useEffect(() => {
    // Subscribe to a global state when a component mounts
    globalState.subscribe(reRender);

    return () => {
      // Unsubscribe from a global state when a component unmounts
      globalState.unsubscribe(reRender);
    };
  });

  function setState(newState) {
    // Send update request to the global state and let it
    // update itself
    globalState.setValue(newState);
  }

  return [state, setState];
}
