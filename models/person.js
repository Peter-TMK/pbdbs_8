const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Check if the phone number matches the specified format
          return /^[0-9]{2,3}-[0-9]{6,}$/.test(value);
        },
        message:
          "Invalid phone number format. Please use the format XX-XXXXXXX.",
      },
    },
  },
  {
    validateBeforeSave: true, // Enable validators
  }
);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
