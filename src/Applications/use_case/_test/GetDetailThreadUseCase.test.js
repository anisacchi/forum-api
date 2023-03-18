const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockThread = new DetailThread({
      id: threadId,
      title: 'Title',
      body: 'This is the body thread',
      date: '2023',
      username: 'user',
    });

    const mockReply = [
      {
        id: replyId,
        username: 'user',
        date: '2023',
        content: 'This is a reply',
        comment_id: commentId,
        is_delete: false,
      },
    ];

    const mockComment = [
      {
        id: commentId,
        username: 'user',
        date: '2023',
        content: 'This is a comment',
        is_delete: false,
      },
    ];

    const expectedResult = {
      ...mockThread,
      comments: mockComment.map(
        (comment) => ({
          id: comment.id,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          date: comment.date,
          username: comment.username,
          replies: mockReply.map(
            (reply) => ({
              id: reply.id,
              content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
              date: reply.date,
              username: reply.username,
            }),
          ),
        }),
      ),
    };

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
    expect(getThread).toStrictEqual(expectedResult);
  });

  it('should orchestrating the get detail thread with deleted comment and reply action correctly', async () => {
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

    const mockReply = [
      {
        id: 'reply-123',
        username: 'user',
        date: '2023',
        content: 'This is a reply',
        comment_id: 'comment-123',
        is_delete: true,
      },
      {
        id: 'reply-456',
        username: 'user',
        date: '2023',
        content: 'This is a reply',
        comment_id: 'comment-456',
        is_delete: false,
      },
    ];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* creating dependency of use case */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(
      getThread.comments
        .filter((comment) => comment.id === 'comment-456')[0].content,
    ).toEqual('**komentar telah dihapus**');
    expect(
      getThread.comments
        .filter((comment) => comment.id === 'comment-123')[0].replies[0].content,
    ).toEqual('**balasan telah dihapus**');
  });
});
