const router = require('@koa/router')();

router.prefix('/'); // Create route prefix for this file
router.get('/', async(ctx, next) => { ctx.body = {"title": "Why are you even seeing this page?"} });
module.exports = router;
