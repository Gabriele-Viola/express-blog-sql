const notFoundMiddleware = (req, res, next) => {
    res.status(404).send("Sorry cant't find that!")
}

module.exports= notFoundMiddleware