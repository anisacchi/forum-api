const AddedReply = require('../../Domains/replies/entities/AddedReply');
const GetReplies = require('../../Domains/replies/entities/GetReplies');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({
    userId, threadId, commentId, content,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, date, userId, threadId, commentId, false],
    };
    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async verifyReplyAvailability(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reply not found.');
    }
  }

  async verifyReplyOwner(credentialId, replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Failed to delete reply. Only the reply owner can delete it.');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT r.id, r.date, r.content, r.comment_id, r.is_delete, u.username
        FROM replies r LEFT JOIN users u
        ON r.owner = u.id
        WHERE r.thread_id = $1
        ORDER BY r.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return new GetReplies(result.rows);
  }
}

module.exports = ReplyRepositoryPostgres;
