const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const credentialId = 'user-123';
    const payload = {
      title: 'Title',
      body: 'This is the thread body',
    };

    const mockThread = new AddedThread({
      id: 'thread-123',
      title: payload.title,
      owner: credentialId,
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /* mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    /* creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(credentialId, payload);

    // Assert
    expect(addedThread).toStrictEqual(mockThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      credentialId,
      new AddThread({
        title: payload.title,
        body: payload.body,
      }),
    );
  });
});
