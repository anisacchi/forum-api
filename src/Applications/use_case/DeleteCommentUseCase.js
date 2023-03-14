class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(credentialId, threadId, commentId) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    await this._commentRepository.verifyOwner(credentialId, commentId);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
