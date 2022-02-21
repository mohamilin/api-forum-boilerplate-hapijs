const GetComment = require('../GetComment');

describe('GetComment entitie', () => {
  it('should throw error not contain property', () => {
    const payload = {
      id: 'comment-123',
    };

    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error not meet data spesification', () => {
    const payload = {
      id: 'comment-123',
      date: true,
      username: 123,
      content: ['123', true],
    };

    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should not throw error', () => {
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'amilin',
      date: '2021-02-10',
      is_delete: true,
    };
    const getComment = new GetComment(payload);
    expect(getComment.id).toStrictEqual(payload.id);
    expect(getComment.username).toStrictEqual(payload.username);
    expect(getComment.date).toStrictEqual(payload.date);
    expect(getComment.content).toStrictEqual(payload.content);
  });
});
