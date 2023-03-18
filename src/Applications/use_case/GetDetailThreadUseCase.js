const GetComments = require('../../Domains/comments/entities/GetComments');
const GetReplies = require('../../Domains/replies/entities/GetReplies');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = new DetailThread(await this._threadRepository.getThreadById(threadId));
    const commentsFromDb = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const repliesFromDb = await this._replyRepository.getRepliesByThreadId(
      threadId,
    );

    const comments = new GetComments(
      commentsFromDb.map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete
          ? '**komentar telah dihapus**'
          : comment.content,
        ...new GetReplies(repliesFromDb
          .filter((reply) => reply.comment_id === comment.id)
          .map((reply) => ({
            id: reply.id,
            content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
            date: reply.date,
            username: reply.username,
          }))),
      })),
    );

    return { ...thread, ...comments };
  }
}

module.exports = GetDetailThreadUseCase;
