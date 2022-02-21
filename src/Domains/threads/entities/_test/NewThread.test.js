const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain property ', () => {
    const payload = {};

    //   Action and assert
    expect(() => new NewThread(payload)).toThrowError(
      'THREAD.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when data not specification', () => {
    const payload = {
      owner: 123,
      title: true,
      body: 12323232,
    };

    expect(() => new NewThread(payload)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should thread correctly', () => {
    const payload = {
      owner: 'user-123',
      title: 'lorem ipsum',
      body: 'lorem ipsum ipsum lorem',
    };

    // action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.owner).toEqual(payload.owner);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
