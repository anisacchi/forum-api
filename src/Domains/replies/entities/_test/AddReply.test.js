const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const user = 123;
    const thread = true;
    const comment = ['comment-123'];
    const payloadContent = [];

    // Action and Assert
    expect(() => new AddReply(user, thread, comment, payloadContent)).toThrowError('ADD_REPLY.NOT_MEET_TYPE_DATA_SPESIFICATION');
  });

  it('should create addReply object correctly', () => {
    // Arrange
    const user = 'user-123';
    const thread = 'thread-123';
    const comment = 'comment-123';
    const payloadContent = 'This is a reply.';

    // Action
    const {
      userId, threadId, commentId, content,
    } = new AddReply(user, thread, comment, payloadContent);

    // Assert
    expect(userId).toEqual(user);
    expect(threadId).toEqual(thread);
    expect(commentId).toEqual(comment);
    expect(content).toEqual(payloadContent);
  });
});
