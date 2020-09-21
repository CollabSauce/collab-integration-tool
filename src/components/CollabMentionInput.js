import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import classNames from 'classnames';

import { useStoreState } from 'src/hooks/useStoreState';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

const CollabMentionInput = ({ value, onChange, className, ...rest }) => {
  const { result: currentUser } = useCurrentUser();
  const { result: memberships } = useStoreState(
    (store) => {
      return store
        .getAll('membership')
        .filter((m) => m.user.id !== currentUser.id)
        .map((m) => ({
          id: m.id,
          display: `${m.user.firstName} ${m.user.lastName}`,
        }));
    },
    [currentUser],
    'membership'
  );

  return (
    <>
      <MentionsInput
        value={value}
        onChange={onChange}
        style={MentionStyle}
        allowSuggestionsAboveCursor
        className={classNames(className, 'text-break')}
        {...rest}
      >
        <Mention
          trigger="@"
          markup="@@@____id__^^^____display__@@@^^^"
          data={memberships}
          displayTransform={(id, display) => `@${display}`}
          style={{
            backgroundColor: '#dadada',
          }}
        />
      </MentionsInput>
    </>
  );
};

export default CollabMentionInput;

// Doing this inline because copying the example in the docs
const MentionStyle = {
  control: {
    backgroundColor: '#fff',
    // fontSize: 14,
    // fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      outline: 'none',
      borderColor: 'transparent',
      backgroundColor: 'inherit',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
  input: {
    overflow: 'auto',
    height: 70,
  },
  highlighter: {
    boxSizing: 'border-box',
    overflow: 'hidden',
    height: 70,
  },
};
