class AddComment {
  constructor(userId, threadId, content) {
    this._verifyPayload(userId, threadId, content);

    this.userId = userId;
    this.threadId = threadId;
    this.content = content;
  }

  _verifyPayload(userId, threadId, content) {
    if (!userId || !threadId || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = AddComment;
