const GetComments = require('../GetComments');

describe('a GetComments entities', () => {
  it('should throw error when payload did not contain needed properties', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '1600-01-01T00:00:00.000Z',
      },
      {
        id: 'comment-456',
        username: 'user2',
        date: '1600-01-01T00:00:00.000Z',
      },
    ];

    // Action and Assert
    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = [
      {
        id: 123,
        username: ['user'],
        date: true,
        content: 2023,
      },
      {
        id: true,
        username: 1,
        date: 'date',
        content: [],
      },
    ];

    // Action and Assert
    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create getComments object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '1600-01-01T00:00:00.000Z',
        content: 'This is a comment.',
      },
      {
        id: 'comment-456',
        username: 'user2',
        date: '1600-01-01T00:00:00.000Z',
        content: 'This is a comment.',
      },
    ];

    // Action
    const result = new GetComments(payload);

    // Assert
    expect(result.comments).toEqual(payload);
  });
});
