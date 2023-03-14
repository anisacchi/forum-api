const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const credentialId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed function */
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId));
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(threadId));
    mockCommentRepository.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve(credentialId, commentId));
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId));

    /* creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(credentialId, threadId, commentId);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(commentId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyOwner).toHaveBeenCalledWith(credentialId, commentId);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(commentId);
  });
});
