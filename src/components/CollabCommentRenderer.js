import React from 'react';
import dompurify from 'dompurify';
import classNames from 'classnames';

const sanitizer = dompurify.sanitize;

const CollabCommentRenderer = ({ content, id, className, ...rest }) => {
  // change @@@__7^^^__Some Name@@@^^^ into <span>Some Name</span>
  const text = content ? content.trim() : '';
  const html = text
    .split('@@@__')
    .join('<span class="bg-300" id="')
    .split('^^^__')
    .join('">')
    .split('@@@^^^')
    .join('</span>');

  return (
    <div
      className={classNames(className, 'text-break')}
      dangerouslySetInnerHTML={{ __html: sanitizer(html) }}
      {...rest}
    />
  );
};

export default CollabCommentRenderer;
