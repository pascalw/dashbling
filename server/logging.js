module.exports.install = server => {
  server.events.on("response", request => {
    console.log(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.url.path
      } ${request.response.statusCode}`
    );
  });
};
