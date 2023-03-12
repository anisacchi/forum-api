/* istanbul ignore file */
const AccessTestHelper = {
  async getUserIdAndAccessToken(server, { username, password }) {
    const payload = { username, password };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...payload,
        fullname: 'User',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload,
    });

    const { id: userId } = responseUser.result.data.addedUser;
    const { accessToken } = responseAuth.result.data;

    return { userId, accessToken };
  },
};

module.exports = AccessTestHelper;
