const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const credentialId = 'user-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'This is a reply',
    };

    const mockReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner: credentialId,
    });

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* mocking needed function */
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId));
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    /* create use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
      credentialId,
      commentId,
      payload,
    );

    // Assert
    expect(addedReply).toStrictEqual(mockReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      credentialId,
      commentId,
      new AddReply({ content: payload.content }),
    );
  });
});
