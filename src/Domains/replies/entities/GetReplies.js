class GetReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    this.replies = payload;
  }

  _verifyPayload(payload) {
    if (payload !== []) {
      payload.forEach(({
        id, content, date, username,
      }) => {
        if (!id || !content || !date || !username) {
          throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
          typeof id !== 'string'
          || typeof content !== 'string'
          || typeof date !== 'string'
          || typeof username !== 'string'
        ) {
          throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
      });
    }
  }
}

module.exports = GetReplies;
