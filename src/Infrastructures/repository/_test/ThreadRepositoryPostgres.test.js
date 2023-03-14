const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
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

  describe('getThreadById function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action and Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError('Thread not found.');
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
      await threadRepositoryPostgres.addThread(credentialId, addThread);
      const threadResponse = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(threadResponse.id).toEqual('thread-123');
    });
  });
});
