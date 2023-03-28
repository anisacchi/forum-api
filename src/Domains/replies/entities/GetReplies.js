class GetReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    this.replies = payload;
  }

  _verifyPayload(payload) {
    if (payload.length !== 0) {
      payload.forEach(
        ({
          id, content, date, username, is_delete: isDelete,
        }) => {
          if (!id || !content || !date || !username || isDelete === 'undefined') {
            throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
          }

          if (
            typeof id !== 'string'
            || typeof content !== 'string'
            || typeof date !== 'string'
            || typeof username !== 'string'
            || typeof isDelete !== 'boolean'
          ) {
            throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPESIFICATION');
          }
        },
      );
    }
  }
}

module.exports = GetReplies;
