class DetailComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.comments = payload;
  }

  _verifyPayload(payload) {
    if (payload !== []) {
      payload.forEach(({
        id, username, date, content,
      }) => {
        if (!id || !username || !date || !content) {
          throw new Error('DETAIL_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
          typeof id !== 'string'
          || typeof username !== 'string'
          || typeof date !== 'string'
          || typeof content !== 'string'
        ) {
          throw new Error('DETAIL_COMMENTS.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
      });
    }
  }
}

module.exports = DetailComments;
