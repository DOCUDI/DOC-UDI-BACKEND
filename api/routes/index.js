const router = require('express').Router();

const userRouter = require('./user.routes'); //user routes complete
const adminRouter = require('./admin.routes');
const testRouter = require('./test.routes');

router.use('/user', userRouter);
router.use('/test', testRouter);
router.use('/doc', adminRouter);

module.exports = router;
