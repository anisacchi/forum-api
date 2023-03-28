const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetComments = require('../../../Domains/comments/entities/GetComments');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const addComment = new AddComment('user-123', 'thread-123', 'This is a comment.');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(comment).toHaveLength(1);
    });

    it('should return comment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const addComment = new AddComment('user-123', 'thread-123', 'This is a comment.');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: addComment.content,
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw error when comment does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('comment-123'),
      ).rejects.toThrowError('Comment not found.');
    });

    it('should not throw error when comment is exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('comment-123'),
      ).resolves.not.toThrowError('Comment not found');
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error when comment and owner do not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-1', 'comment-123'))
        .rejects.toThrowError('Failed to delete comment. Only the comment owner can delete it.');
    });

    it('should not throw error when comment and owner match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action and Assert
      expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123'))
        .resolves.not.toThrowError('Failed to delete comment. Only the comment owner can delete it.');
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(deletedComment[0].is_delete).toBeTruthy();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return a comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2023',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action
      const comment = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123',
      );

      // Assert
      expect(comment).toStrictEqual(new GetComments([{
        id: 'comment-123',
        date: '2023',
        content: 'This is a comment',
        is_delete: false,
        username: 'user',
      }]));
    });
  });
});
