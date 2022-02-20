const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async addComment(request, h) {
    const credential = request.auth.credentials;
    const { threadId } = request.params;

    const payload = {
      content: request.payload.content,
      threadId,
      userId: credential.id,
    };
    const postComment = this._container.getInstance(AddCommentUseCase.name);
    const addComment = await postComment.execute(payload);

    const addedComment = {
      id: addComment.id,
      content: addComment.content,
      owner: addComment.owner,
    };

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteComment(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteComment = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    const payload = { commentId, threadId, owner };
    await deleteComment.execute(payload);
    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
