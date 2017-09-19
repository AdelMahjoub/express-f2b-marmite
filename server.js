require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// ========================================================================================================
//  webpack-dev-middleware https://webpack.js.org/guides/development/#using-webpack-dev-middleware
// ========================================================================================================
const webpack              = app.get('env') === 'development' ? require('webpack')                : null;
const webpackDevMiddleware = app.get('env') === 'development' ? require('webpack-dev-middleware') : null;
const config               = app.get('env') === 'development' ? require('./webpack.config')       : null;
const compiler             = app.get('env') === 'development' ? webpack(config)                   : null;
// ========================================================================================================

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// ==============================================================================
// webpack-manifest-plugin https://www.npmjs.com/package/webpack-manifest-plugin
// ==============================================================================
if(app.get('env') === 'production') {
  require('./configs/server.prod.config')(app);
}
// ==============================================================================

app.use(
  app.get('env') === 'development' ?
  webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }) 
  :
  express.static(path.resolve(__dirname, './dist'))
);

app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(app.get('port'), () => {
  console.log(`Server running:\nPort: ${app.get('port')}\nMode: ${app.get('env')}`);
});

module.exports = app;