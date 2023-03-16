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
});
