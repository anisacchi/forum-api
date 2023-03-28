const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const user = 123;
    const thread = true;
    const payloadContent = ['This is a comment.'];

    // Action and Assert
    expect(() => new AddComment(user, thread, payloadContent)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const user = 'user-123';
    const thread = 'thread-123';
    const payloadContent = 'This is a comment.';

    // Action
    const { userId, threadId, content } = new AddComment(user, thread, payloadContent);

    // Assert
    expect(userId).toEqual(user);
    expect(threadId).toEqual(thread);
    expect(content).toEqual(payloadContent);
  });
});
