const GetThread = require('../GetThread');

describe('Thread entities', () => {
  it('should throw error when payload did not contain', () => {
    const payload = {};
    //   Action and assert
    expect(() => new GetThread(payload)).toThrowError(
      'THREAD.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when paylod not data specificication', () => {
    const payload = {
      id: 123,
      username: true,
      title: true,
      body: 12323232,
      date: true,
      owner: true,
    };

    //   Action and assert
    expect(() => new GetThread(payload)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should thread correctly', () => {
    const payload = {
      id: 'thread-123',
      username: 'amilin',
      title: 'lorem ipsum',
      body: 'lorem ipsum ipsum lorem',
      date: '2022-01-22T13:52:54.016+07:00',
      owner: 'user-123',
    };

    //   Action
    const thread = new GetThread(payload);

    expect(thread.username).toEqual(payload.username);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
  });
});
