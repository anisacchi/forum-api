const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetComments = require('../../../Domains/comments/entities/GetComments');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThread = new DetailThread({
      id: threadId,
      title: 'Title',
      body: 'This is the body thread',
      date: '2023',
      username: 'user',
    });

    const mockComment = [
      {
        id: commentId,
        username: 'user',
        date: '2023',
        content: 'This is a comment',
        is_delete: false,
      },
    ];

    const expectedComment = new GetComments([
      {
        id: commentId,
        username: 'user',
        date: '2023',
        content: 'This is a comment',
      },
    ]);

    const expectedResult = {
      ...mockThread,
      ...expectedComment,
    };

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(getThread).toStrictEqual(expectedResult);
  });

  it('should orchestrating the get detail thread with deleted comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThread = new DetailThread({
      id: threadId,
      title: 'Title',
      body: 'This is the body thread',
      date: '2023',
      username: 'user',
    });

    const mockComment = [
      {
        id: 'comment-123',
        username: 'user',
        date: '2023',
        content: 'This is a comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'user',
        date: '2023',
        content: 'This is a comment',
        is_delete: true,
      },
    ];

    const expectedComment = new GetComments([
      {
        id: 'comment-123',
        username: 'user',
        date: '2023',
        content: 'This is a comment',
      },
      {
        id: 'comment-456',
        username: 'user',
        date: '2023',
        content: '**komentar telah dihapus**',
      },
    ]);

    const expectedResult = {
      ...mockThread,
      ...expectedComment,
    };

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* creating dependency of use case */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(getThread).toStrictEqual(expectedResult);
  });
});
