const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const authController = require('./../controllers/authController')



exports.getAllusers = async (req, res) => {
    User.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving messages.",
            });
        });
};
exports.getUser = (req, res) => {
    User.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Message not found with id " + req.params.id,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Message not found with id " + req.params.id,
                });
            }
            return res.status(500).send({
                message: "Error retrieving message with id " + req.params.id,
            });
        });
};

exports.createUser = (req, res) => {
    User.findByIdAndUpdate(
        req.params.messageId,
        {
            message: req.body.message,
        },
        { new: true }
    )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Message not found with id " + req.params.messageId,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Message not found with id " + req.params.messageId,
                });
            }
            return res.status(500).send({
                message: "Error updating message with id " + req.params.messageId,
            });

        })

}


exports.updateUser = catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
})
