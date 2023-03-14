const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

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

      const addComment = new AddComment({
        content: 'This is a comment.',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(
        'user-123',
        'thread-123',
        addComment,
      );

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

      const addComment = new AddComment({
        content: 'This is a comment.',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        'user-123',
        'thread-123',
        addComment,
      );

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

  describe('getCommentById function', () => {
    it('should throw error when comment does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action and Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-123'),
      ).rejects.toThrowError('Comment not found.');
    });

    it('should return a comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-123',
      );

      // Assert
      expect(comment.id).toEqual('comment-123');
    });
  });

  describe('verifyOwner function', () => {
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
      await expect(commentRepositoryPostgres.verifyOwner('user-1', 'comment-123'))
        .rejects.toThrowError('Failed to delete comment. Only the comment owner can delete it.');
    });

    it('should return a comment correctly when comment and owner match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action and Assert
      expect(commentRepositoryPostgres.verifyOwner('user-123', 'comment-123'))
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
});
