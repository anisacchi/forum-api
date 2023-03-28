class GetComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.comments = payload;
  }

  _verifyPayload(payload) {
    if (payload.length !== 0) {
      payload.forEach(
        ({
          id, username, date, content, is_delete: isDelete,
        }) => {
          if (
            !id || !username || !date || !content || isDelete === 'undefined'
          ) {
            throw new Error('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
          }

          if (
            typeof id !== 'string'
            || typeof username !== 'string'
            || typeof date !== 'string'
            || typeof content !== 'string'
            || typeof isDelete !== 'boolean'
          ) {
            throw new Error('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPESIFICATION');
          }
        },
      );
    }
  }
}

module.exports = GetComments;
