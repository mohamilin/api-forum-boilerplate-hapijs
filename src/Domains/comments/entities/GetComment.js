class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, content, date, is_delete } = payload;
    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;
    this.is_delete = is_delete;
  }

  _verifyPayload({ id, date, username, content, is_delete }) {
    console.log(typeof id);
    console.log(typeof date);
    console.log(typeof username);
    console.log(typeof date);
    console.log(typeof is_delete);

    if (!id || !date || !username || !content) {
      throw new Error("GET_COMMENT.NOT_CONTAIN_NEEDED");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof content !== "string" ||
      typeof is_delete !== "boolean"
    ) {
      throw new Error("GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetComment;
