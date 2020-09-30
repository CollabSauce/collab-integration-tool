import React from 'react';
import dompurify from 'dompurify';
import linkifyHtml from 'linkifyjs/html';
import classNames from 'classnames';

const sanitizer = dompurify.sanitize;

const CollabCommentRenderer = ({ content, id, className, ...rest }) => {
  // change @@@__7^^^__Some Name@@@^^^ into <span>Some Name</span>
  const text = content ? content.trim() : '';
  const html = text
    .replace(/\n\r?/g, '<br />')
    .split('@@@__')
    .join('<span class="bg-300" id="')
    .split('^^^__')
    .join('">')
    .split('@@@^^^')
    .join('</span>');

  const htmlWithATags = linkifyHtml(html, {
    attributes: {
      rel: 'noopener noreferrer',
    },
  });

  const sanitizedHtml = sanitizer(htmlWithATags, { ADD_ATTR: ['target'] });

  return (
    <div
      className={classNames(className, 'text-break')}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      {...rest}
    />
  );
};

export default CollabCommentRenderer;
