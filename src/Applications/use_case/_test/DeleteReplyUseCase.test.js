const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const credentialId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(threadId));
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId));
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replyId));
    mockReplyRepository.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve(credentialId, replyId));
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replyId));

    /* creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(credentialId, threadId, commentId, replyId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith(replyId);
    expect(mockReplyRepository.verifyOwner).toHaveBeenCalledWith(credentialId, replyId);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(replyId);
  });
});
