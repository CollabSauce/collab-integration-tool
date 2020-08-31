import { useCallback, useEffect, useState, useMemo } from 'react';

import { jsdataStore } from 'src/store/jsdata';

// TODO: This can be made much more performant. Listen on individual records and/or collections?
/*
Examples of useStoreState
const { result: currentUser } = useStoreState(store => store.get('user', currentUserId), [currentUserId])
const { result: posts } = useStoreState(store => store.getAll('post'), [], 'post')
*/
export const useStoreState = (getState, dependencies = [], collectionName) => {
  // freeze getState function
  const getDesiredState = useCallback(getState, dependencies);

  // Set initial result - if `dependencies` dont change, this will only be "run" once.
  // If `depedencies` do change, this `result` value will be updated (and thus `state` will be updated in setState below).
  const result = useMemo(() => getDesiredState(jsdataStore), [getDesiredState]);
  const [state, setState] = useState({ result });

  // when dependencies change, we need to call setState on the new result.
  useEffect(() => {
    setState({ result });
  }, [result]);

  // when record/collection changes, get updated values and set it on the state.
  const onChange = useCallback(
    (_, data) => {
      const result = getDesiredState(jsdataStore);
      setState({ result });
    },
    [getDesiredState]
  );

  // `result` will either be a record, or a collection of records.
  // Listen on that specific record (or collection of records) for a change
  useEffect(() => {
    let listenObj = result;
    if (collectionName) {
      listenObj = jsdataStore.getCollection(collectionName);
    }
    if (listenObj) {
      listenObj.on('all', onChange);
    }

    return () => {
      if (listenObj) {
        listenObj.off('all', onChange);
      }
    };
  }, [onChange, result, collectionName]);

  return state;
};
