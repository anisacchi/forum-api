const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(credentialId, threadId, commentId, payload) {
    const addReply = new AddReply(payload);
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    return this._replyRepository.addReply(credentialId, commentId, addReply);
  }
}

module.exports = AddReplyUseCase;
