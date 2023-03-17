const GetReplies = require('../GetReplies');

describe('ad GetReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'reply-123',
        username: 'user1',
        date: '1600-01-01T00:00:00.000Z',
      },
      {
        id: 'reply-456',
        username: 'user2',
        date: '1600-01-01T00:00:00.000Z',
      },
    ];

    // Action and Assert
    expect(() => new GetReplies(payload)).toThrowError('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = [
      {
        id: 123,
        content: ['This is a reply'],
        date: 2023,
        username: true,
      },
      {
        id: 456,
        content: ['This is a reply'],
        date: 2023,
        username: false,
      },
    ];

    // Action and Assert
    expect(() => new GetReplies(payload)).toThrowError('GET_REPLIES.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create getReplies object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'reply-123',
        content: 'This is a reply',
        username: 'user1',
        date: '1600-01-01T00:00:00.000Z',
      },
      {
        id: 'reply-456',
        content: 'This is a reply',
        username: 'user2',
        date: '1600-01-01T00:00:00.000Z',
      },
    ];

    // Action
    const result = new GetReplies(payload);

    // Assert
    expect(result.replies).toEqual(payload);
  });
});
