const path = require('path');

const AutoPrefixer = require('autoprefixer');
const PostcssFontGrabber = require('postcss-font-grabber').postcssFontGrabber;
const PostcssImportUrl = require('postcss-import-url');

module.exports = {
  plugins: [
    AutoPrefixer(),
    PostcssFontGrabber({
      cssSrc: path.join(__dirname, 'src/views/style'),
      cssDest: path.join(__dirname, 'src/views/style'),
      fontDest: path.join(__dirname, 'dist'),
    }),
    PostcssImportUrl({
      modernBrowser: true,
    }),
  ],
};
