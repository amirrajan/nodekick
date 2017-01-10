const environment = {
  development: { port: 3000, },
  production: { port: 80, }
}[process.env.NODE_ENV || 'development'];


export {environment as config};
