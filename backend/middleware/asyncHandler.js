const asyncHandler = (controllerFunction) => (req, res, next) => {
    return Promise.resolve(controllerFunction(req, res, next)).catch(next)
}
export default asyncHandler