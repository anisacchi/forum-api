const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const AccessTestHelper = require('../../../../tests/AccessTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const payload = {
        title: 'Title',
        body: 'This is the thread body',
      };

      const server = await createServer(container);
      const { accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when request has no access token', async () => {
      // Arrange
      const payload = {
        title: 'Title',
        body: 'This is the thread body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        title: 'Title',
      };

      const server = await createServer(container);
      const { accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Failed to add thread. The required properties are missing.');
    });

    it('should response 400 when request payload not meet type data spesification', async () => {
      // Arrange
      const payload = {
        title: true,
        body: [],
      };

      const server = await createServer(container);
      const { accessToken } = await AccessTestHelper.getUserIdAndAccessToken(
        server,
        {
          username: 'user',
          password: 'secret',
        },
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Failed to add thread. The type data of the property does not match.');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and detail thread', async () => {
      // Arrange
      const threadId = 'thread-123';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'user2' });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', owner: 'user-1', threadId });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', owner: 'user-2', threadId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 200 and detail thread with deleted comments', async () => {
      // Arrange
      const threadId = 'thread-123';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'user2' });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-1' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', owner: 'user-1', threadId, isDelete: true,
      });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', owner: 'user-2', threadId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found.');
    });
  });
});
