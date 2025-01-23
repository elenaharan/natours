// const fs = require('fs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`);
// );

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //create an error if the user POSTs the password
  if (req.body.password || req.body.passwordConfirm)
    next(
      new AppError(
        'This route is not for password updates! Please use /updateMyPassword',
        400,
      ),
    );

  //update user doc: we can use findByIdAndUpdate because we are not dealing with updating sensitive data like password
  //new:true => returns the new updated object instead of the old one
  //runValidators: true => check if supplied fields are correct
  //we will need to filter the body so that it only contains certain fields that are allowed to be updated
  //for ex, if body.role = 'admin', this should not be allowed
  // const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = User.findByIdAndUpdate(req.user.id, x, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
