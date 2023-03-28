const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetComments = require('../../../Domains/comments/entities/GetComments');
const GetReplies = require('../../../Domains/replies/entities/GetReplies');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const firstCommentId = 'comment-123';
    const secondCommentId = 'comment-456';
    const firstReplyId = 'reply-123';
    const secondReplyId = 'reply-456';

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: 'Title',
      body: 'This is the body thread',
      date: '2023',
      username: 'user',
    });

    const mockComment = new GetComments([
      {
        id: firstCommentId,
        username: 'user',
        date: '2023',
        content: 'This is a comment',
        is_delete: false,
      },
      {
        id: secondCommentId,
        username: 'user',
        date: '2023',
        content: 'This is a comment',
        is_delete: true,
      },
    ]);

    const mockReply = new GetReplies([
      {
        id: firstReplyId,
        username: 'user',
        date: '2023',
        content: 'This is a reply',
        comment_id: firstCommentId,
        is_delete: true,
      },
      {
        id: secondReplyId,
        username: 'user',
        date: '2023',
        content: 'This is a reply',
        comment_id: secondCommentId,
        is_delete: false,
      },
    ]);

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComment));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(mockReply));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
    expect(getThread).toStrictEqual({
      id: threadId,
      title: mockDetailThread.title,
      body: mockDetailThread.body,
      date: mockDetailThread.date,
      username: mockDetailThread.username,
      comments: [
        {
          id: firstCommentId,
          username: mockComment.comments[0].username,
          date: mockComment.comments[0].date,
          content: mockComment.comments[0].content,
          replies: [
            {
              id: firstReplyId,
              content: '**balasan telah dihapus**',
              date: mockReply.replies[0].date,
              username: mockReply.replies[0].username,
            },
          ],
        },
        {
          id: secondCommentId,
          username: mockComment.comments[1].username,
          date: mockComment.comments[1].date,
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: secondReplyId,
              content: mockReply.replies[1].content,
              date: mockReply.replies[1].date,
              username: mockReply.replies[1].username,
            },
          ],
        },
      ],
    });
  });

  it('should orchestrating the get detail thread with deleted comment and reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: 'Title',
      body: 'This is the body thread',
      date: '2023',
      username: 'user',
    });

    const mockComment = new GetComments([
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
    ]);

    const mockReply = new GetReplies([
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
    ]);

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* creating dependency of use case */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
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
    expect(getThread.comments
      .filter((comment) => comment.id === 'comment-456')[0].content).toEqual('**komentar telah dihapus**');
    expect(getThread.comments
      .filter((comment) => comment.id === 'comment-123')[0].replies[0].content).toEqual('**balasan telah dihapus**');
  });
});
