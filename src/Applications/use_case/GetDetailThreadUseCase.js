const DetailComments = require('../../Domains/comments/entities/DetailComments');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const threadFromDb = await this._threadRepository.getThreadById(threadId);
    const commentsFromDb = await this._commentRepository.getCommentsByThreadId(threadId);

    const changeDeletedCommentsContent = commentsFromDb.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));

    const thread = new DetailThread(threadFromDb);
    const comments = new DetailComments(changeDeletedCommentsContent);
    return { ...thread, ...comments };
  }
}

module.exports = GetDetailThreadUseCase;
