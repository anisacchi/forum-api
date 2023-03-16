const routes = require('./routes');
const RepliesHandler = require('./handler');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const replyHandler = new RepliesHandler(container);
    server.route(routes(replyHandler));
  },
};
