const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.addThread,
    options: {
      auth: 'api_forum',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getDetailThread,
  },
];

module.exports = routes;
