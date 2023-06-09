const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComments = require('../../Domains/comments/entities/GetComments');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ userId, threadId, content }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, userId, threadId, false],
    };
    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async verifyCommentAvailability(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment not found.');
    }
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Failed to delete comment. Only the comment owner can delete it.');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, c.date, c.content, c.is_delete, u.username
        FROM comments c LEFT JOIN users u
        ON c.owner = u.id
        WHERE c.thread_id = $1
        ORDER BY c.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return new GetComments(result.rows);
  }
}

module.exports = CommentRepositoryPostgres;
