const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(credentialId, commentId, payload) {
    const addReply = new AddReply(payload);
    await this._commentRepository.getCommentById(commentId);
    return this._replyRepository.addReply(credentialId, commentId, addReply);
  }
}

module.exports = AddReplyUseCase;
