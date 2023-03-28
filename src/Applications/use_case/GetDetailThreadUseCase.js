class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    const getComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const getReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    const comments = (getComments.comments).map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content,
      replies: getReplies.replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        })),
    }));

    return { ...thread, comments };
  }
}

module.exports = GetDetailThreadUseCase;
