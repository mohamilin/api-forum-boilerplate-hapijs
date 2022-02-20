const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.addThread,
    options: {
      auth: "api_forum",
    },
  },
];

module.exports = routes;
