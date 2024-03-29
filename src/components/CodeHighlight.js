import React from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import lightTheme from 'prism-react-renderer/themes/duotoneLight';
import darkTheme from 'prism-react-renderer/themes/dracula';

const CodeHighlight = ({ code, language, dark }) => {
  return (
    <Highlight {...defaultProps} code={code} language={language} theme={dark ? darkTheme : lightTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className}`}
          style={{
            ...style,
            padding: '10px',
            paddingTop: '40px',
            borderRadius: '4px',
            border: 0,
            fontSize: '12px',
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
CodeHighlight.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
  dark: PropTypes.bool,
};

CodeHighlight.defaultProps = { language: 'html', dark: false };

export default CodeHighlight;
