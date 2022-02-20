const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.addComment,
    options: {
      auth: 'api_forum',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteComment,
    options: {
      auth: 'api_forum',
    },
  },
];

module.exports = routes;
