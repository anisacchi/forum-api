class AddReply {
  constructor(userId, threadId, commentId, content) {
    this._verifyPayload(userId, threadId, commentId, content);

    this.userId = userId;
    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyPayload(userId, threadId, commentId, content) {
    if (!userId || !threadId || !commentId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_TYPE_DATA_SPESIFICATION');
    }
  }
}

module.exports = AddReply;
