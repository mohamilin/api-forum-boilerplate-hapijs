const ThreadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadHandler = new ThreadHandler(container);
    server.route(routes(threadHandler));
  },
};
