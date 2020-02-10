const router = require('@koa/router')();
const fs = require('fs');
const path = require('path');

router.prefix('/public'); // Create route prefix for this file

router.get('/', async(ctx, next) => {
  try {
    ctx.set('Content-type', 'text/html');
    const url = path.join(__dirname, '../', 'views', 'html', 'index.html');
    const html = fs.readFileSync(url);
    ctx.body = await html
  } catch (e) {console.error(e);}
});

module.exports = router;
