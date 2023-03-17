const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedRply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const addReply = new AddReply({ content: 'This is a reply' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply('user-123', 'comment-123', addReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return reply correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const addReply = new AddReply({ content: 'This is a reply' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply('user-123', 'comment-123', addReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedRply({
          id: 'reply-123',
          content: addReply.content,
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getReplyById function', () => {
    it('should throw error when reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action and Assert
      await expect(replyRepositoryPostgres.getReplyById('reply-123')).rejects.toThrowError('Reply not found.');
    });

    it('should return reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      const reply = await replyRepositoryPostgres.getReplyById('reply-123');

      // Assert
      expect(reply.id).toEqual('reply-123');
    });
  });

  describe('verifyOwner function', () => {
    it('should throw error when reply and owner do not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyOwner('user-1', 'reply-123'))
        .rejects.toThrowError('Failed to delete reply. Only the reply owner can delete it.');
    });

    it('should not throw error when reply and owner match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyOwner('user-123', 'reply-123'))
        .resolves.not.toThrowError('Failed to delete reply. Only the reply owner can delete it.');
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123', commentId: 'comment-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const deletedReply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(deletedReply[0].is_delete).toBeTruthy();
    });
  });
});
