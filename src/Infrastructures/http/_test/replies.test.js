const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const AccessTestHelper = require('../../../../tests/AccessTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {
        content: 'This is a reply',
      };

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 401 when request has no access token', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {
        content: 'This is a reply',
      };

      const server = await createServer(container);

      const { userId } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {
        content: 'This is a reply',
      };

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-1/comments/${commentId}/replies`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found.');
    });

    it('should response 404 when comment does not exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {
        content: 'This is a reply',
      };

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment not found.');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {};

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Failed to add reply. The required properties are missing.');
    });

    it('should response 400 when request payload not meet type data spesification', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {
        content: ['This is a reply'],
      };

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Failed to add reply. The type data of the property does not match.');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and is_delete has value true', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, owner: userId, commentId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const deletedReply = await RepliesTableTestHelper.findReplyById(replyId);

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(deletedReply[0].is_delete).toBeTruthy();
    });
  });
});
