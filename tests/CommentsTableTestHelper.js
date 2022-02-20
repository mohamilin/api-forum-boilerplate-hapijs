/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const addComment = async ({
  id = "comment-123",
  content = "lorem ipsum",
  threadId = "thread-123",
  owner = "user-123",
}) => {
  const date = new Date().toISOString();
  const query = {
    text: "INSERT INTO comments VALUES ($1,$2,$3,$4,$5)",
    values: [id, content, threadId, owner, date],
  };
  return await pool.query(query);
};

const getCommentById = async (id) => {
  const query = {
    text: "SELECT * FROM comments where id = $1",
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const cleanTableComment = async () => {
  await pool.query("DELETE FROM comments WHERE 1=1");
};

const ThreadTableTestHelper = {
  addComment,
  getCommentById,
  cleanTableComment,
};

module.exports = ThreadTableTestHelper;
