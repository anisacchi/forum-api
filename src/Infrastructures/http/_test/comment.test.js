const AccessTestHelper = require('../../../../tests/AccessTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const payload = {
        content: 'This is a comment.',
      };

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(server, {
        username: 'user',
        password: 'secret',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when request has no access token', async () => {
      // Arrange
      const threadId = 'thread-123';
      const payload = {
        content: 'This is a comment.',
      };

      const server = await createServer(container);
      const { userId } = await AccessTestHelper.getUserIdAndAccessToken(server, {
        username: 'user',
        password: 'secret',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
      const payload = {
        content: 'This is a comment.',
      };

      const server = await createServer(container);
      const { accessToken } = await AccessTestHelper.getUserIdAndAccessToken(server, {
        username: 'user',
        password: 'secret',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const threadId = 'thread-123';
      const payload = {};

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(server, {
        username: 'user',
        password: 'secret',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Failed to add comment. The required properties are missing.');
    });

    it('should response 400 when request payload not meet type data spesification', async () => {
      // Arrange
      const threadId = 'thread-123';
      const payload = {
        content: ['This is a comment.'],
      };

      const server = await createServer(container);
      const { userId, accessToken } = await AccessTestHelper.getUserIdAndAccessToken(server, {
        username: 'user',
        password: 'secret',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Failed to add comment. The type data of the property does not match.');
    });
  });
});
