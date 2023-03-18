class GetComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.comments = payload;
  }

  _verifyPayload(payload) {
    if (payload !== []) {
      payload.forEach(({
        id, username, date, content, replies,
      }) => {
        if (!id || !username || !date || !content || !replies) {
          throw new Error('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
          typeof id !== 'string'
          || typeof username !== 'string'
          || typeof date !== 'string'
          || typeof content !== 'string' || !Array.isArray(replies)
        ) {
          throw new Error('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
      });
    }
  }
}

module.exports = GetComments;
