// const fs = require('fs');
const multer = require('multer');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ dest: 'public/img/users' });
exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`);
// );

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  //create an error if the user is trying to update password
  if (req.body.password || req.body.passwordConfirm)
    next(
      new AppError(
        'This route is not for password updates! Please use /updateMyPassword',
        400,
      ),
    );

  //filter out fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //update user doc: we can use findByIdAndUpdate because we are not dealing with updating sensitive data like password
  //new:true => returns the new updated object instead of the old one
  //runValidators: true => check if supplied fields are correct
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please, use /signup instead.',
  });
};

exports.getUserById = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);
//DO NOT USE TO UPDATE PASSWORD
exports.updateUser = factory.updateOne(User);
