const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const credentialId = 'user-123';

      await UsersTableTestHelper.addUser({ id: credentialId });

      const addThread = new AddThread({
        title: 'Title',
        body: 'This is the thread body',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(credentialId, addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const credentialId = 'user-123';

      await UsersTableTestHelper.addUser({ id: credentialId });

      const addThread = new AddThread({
        title: 'Title',
        body: 'This is the thread body',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(credentialId, addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: credentialId,
      }));
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw error when thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-123'),
      ).rejects.toThrowError('Thread not found.');
    });

    it('should not throw error when thread is exist', async () => {
      // Arrange
      const credentialId = 'user-123';
      const threadId = 'thread-123';
      const username = 'user';

      await UsersTableTestHelper.addUser({ id: credentialId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: credentialId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability(threadId),
      ).resolves.not.toThrowError('Thread not found.');
    });
  });

  describe('getDetailThreadById function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action and Assert
      await expect(
        threadRepositoryPostgres.getDetailThreadById('thread-123'),
      ).rejects.toThrowError('Thread not found.');
    });

    it('should return thread correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const credentialId = 'user-123';
      const username = 'user';

      const addThread = new AddThread({
        title: 'Title',
        body: 'This is the thread body',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await UsersTableTestHelper.addUser({ id: credentialId, username });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: addThread.title,
        body: addThread.body,
        owner: credentialId,
        date: '2023',
      });

      // Action
      const threadResponse = await threadRepositoryPostgres.getDetailThreadById(threadId);

      // Assert
      expect(threadResponse).toStrictEqual(new DetailThread({
        id: threadId,
        title: addThread.title,
        body: addThread.body,
        date: '2023',
        username,
      }));
    });
  });
});
