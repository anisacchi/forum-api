const DetailThreads = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Title',
      body: 'This is the body thread.',
      username: 'user',
    };

    // Action and Assert
    expect(() => new DetailThreads(payload)).toThrowError('DETAIL_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: ['Title'],
      body: true,
      date: 2023,
      username: [],
    };

    // Action and Assert
    expect(() => new DetailThreads(payload)).toThrowError('DETAIL_THREADS.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Title',
      body: 'This is the body thread.',
      date: '1600-01-01T00:00:00.000Z',
      username: 'user',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new DetailThreads(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
