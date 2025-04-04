

module.exports = async function (req, res, next) {
    const token = await req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'Missing token',
            data: null
        });
    }
    next();
}
