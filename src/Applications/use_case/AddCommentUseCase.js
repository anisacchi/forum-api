const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(credentialId, threadId, payload) {
    const addComment = new AddComment(payload);
    await this._threadRepository.getThreadById(threadId);
    return this._commentRepository.addComment(credentialId, threadId, addComment);
  }
}

module.exports = AddCommentUseCase;
