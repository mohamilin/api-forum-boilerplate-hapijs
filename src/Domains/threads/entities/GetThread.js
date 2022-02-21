class Thread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, username, title, body, date,
    } = payload;

    this.id = id;
    this.username = username;
    this.title = title;
    this.body = body;
    this.date = date;
  }

  _verifyPayload({
    id, username, title, body, date,
  }) {
    if (!id || !username || !title || !body || !date) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
