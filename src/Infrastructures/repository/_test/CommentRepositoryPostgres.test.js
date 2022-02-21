// Layer Infrastructures
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
// DB
const pool = require("../../database/postgres/pool");
// Layer Domains
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const DeletedComment = require("../../../Domains/comments/entities/DeletedComment");
// Layer Commons / Handle error
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
// test
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres interface", () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTableComment();
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should correctly comment", async () => {
      //   Arrange
      const payload = {
        threadId: "thread-123",
        content: "lorem ipsum ",
        owner: "user-123",
      };

      const { content, threadId, owner } = { ...payload };
      const newComment = new NewComment({ content, threadId, owner });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
        title: "Title thread",
        body: "Content body thread",
      });

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      );
      const comment = await CommentTableTestHelper.getCommentById(
        "comment-123"
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: newComment.content,
          threadId: newComment.threadId,
          owner: newComment.owner,
        })
      );
      expect(comment).toHaveLength(1);
      expect(comment[0].content).toBe(payload.content);
    });
  });

  describe("verifyAvailableComment function", () => {
    it("verifyAvailableComment: Should throw error not found commentId", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-125")
      ).rejects.toThrowError(NotFoundError);
    });

    it("verifyAvailableComment: Should not error, found commentId", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentTableTestHelper.addComment({
        id: "comment-125",
        threadId: "thread-123",
        owner: "user-123",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-125")
      ).resolves.not.toThrowError();
    });
  });

  describe("verifyOwnerComment function", () => {
    it("verifyOwnerComment : Should throw error not found commentId", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyOwnerComment({
          owner: "user-123",
          commentId: "comment-123",
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it("verifyOwnerComment : Should not error, found commentId", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentTableTestHelper.addComment({
        id: "comment-125",
        threadId: "thread-123",
        owner: "user-123",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(
        commentRepositoryPostgres.verifyOwnerComment({
          owner: "user-123",
          commentId: "comment-125",
        })
      ).resolves.not.toThrowError();
    });
  });

  describe("deleteComment function", () => {
    it("deleteComment : Should not error, success soft delete", async () => {
      const payload = {
        commentId: "comment-125",
        threadId: "thread-123",
        owner: "user-xxxx",
      };

      const deleteComment = new DeletedComment(payload);
      await UsersTableTestHelper.addUser({
        id: "user-xxx",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-xxx",
      });
      await CommentTableTestHelper.addComment({
        id: "comment-125",
        threadId: "thread-123",
        owner: "user-xxx",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment(deleteComment);
      const deletedComment = await CommentTableTestHelper.getCommentById(
        "comment-125"
      );
      expect(deletedComment[0]).toBeDefined();
      expect(deletedComment[0].id).toEqual("comment-125");
      expect(deletedComment[0].date).toBeDefined();
      expect(deletedComment[0].is_delete).toEqual(true);
    });
  });

  describe("getCommentWithThread function", () => {
    it("getCommentWithThread: should correctly", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-xxx",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-yyyy",
        owner: "user-xxx",
      });
      await CommentTableTestHelper.addComment({
        id: "comment-zzz",
        threadId: "thread-yyyy",
        owner: "user-xxx",
        content: "lorem ipsum",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepositoryPostgres.getCommentWithThread(
        "thread-yyyy"
      );

      expect(comments).toHaveLength(1);
      expect(comments[0]).toHaveProperty("id");
      expect(comments[0]).toHaveProperty("username");
      expect(comments[0]).toHaveProperty("date");
      expect(comments[0].id).toEqual("comment-zzz");
      expect(comments[0]).toHaveProperty("username");
      expect(comments[0].username).toEqual("dicoding");
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toEqual("lorem ipsum");
      expect(comments[0].is_delete).toEqual(false);
    });
  });
});
