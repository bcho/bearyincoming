'use strict';

const fetch = require('isomorphic-fetch');

class Incoming {

  constructor(hook) {
    this.reset();

    this.hook = hook;
  }

  /**
   * Create a new incoming message.
   *
   * @param {String} hook
   */
  make(hook) {
    return new Incoming(hook);
  }

  /**
   * Reset incoming message.
   */
  reset() {
    this.text = null;
    this.markdown = false;
    this.channel = null;
    this.attachments = [];
  }

  /**
   * Set destinate channel.
   *
   * @param {String} channel
   * @return this
   */
  to(channel) {
    this.channel = channel;

    return this;
  }

  /**
   * Set text content.
   *
   * @param {String} text
   * @param {Boolean} markdown Use markdown? Defaults to `false`.
   * @return this
   */
  withText(text, markdown) {
    this.text = text;
    this.markdown = markdown || false;

    return this;
  }

  /**
   * Set text with markdown.
   *
   * @param {String} text
   * @return this
   */
  withMarkdown(text) {
    return this.withText(text, true);
  }

  /**
   * Add an attachment.
   *
   * @param {Attachment} attachment
   * @return this
   */
  withAttachment(attachment) {
    this.attachments.push(attachment);

    return this;
  }

  /**
   * Build incoming message.
   *
   * @return {Object}
   */
  build() {
    const message = {
      text: this.text,
      markdown: this.markdown,
    };

    if (this.channel) message.channel = this.channel;

    if (this.attachments.length > 0) {
      message.attachments = [];
      for (let attachment of this.attachments) {
        if (!attachment.title && !attachment.text) {
          throw new Error('attachment title or text is required');
        }
        message.attachments.push(attachment);
      }
    }

    return message;
  }

  /**
   * Push an message to BearyChat.
   *
   * @param {String} hook
   * @return {Promise}
   */
  push(hook) {
    if (!hook) hook = this.hook;
    if (!hook) throw new Error('hook required');

    const message = JSON.stringify(this.build());
    this.reset();

    return fetch(hook, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: message,
    })
    .then((resp) => {
      if (resp.status !== 200) throw new Error('request failed');
      return resp.json();
    })
    .then((rv) => {
      if (rv.code !== 0) throw new Error(JSON.stringify(rv));

      return rv;
    });
  }

  /**
   * Push an message to BearyChat with hook.
   *
   * @param {String} hook
   * @return {Promise}
   */
  pushTo(hook) {
    return this.push(hook);
  }

}

module.exports = Incoming;
