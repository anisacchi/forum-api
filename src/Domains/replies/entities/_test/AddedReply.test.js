const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed propety', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'This is a reply',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did meet type data spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: [],
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_TYPE_DATA_SPESIFICATION');
  });

  it('should create addedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'This is a reply',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedReply(payload);

    // Arrange
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
