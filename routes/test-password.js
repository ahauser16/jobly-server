const bcrypt = require("bcrypt");

const hashedPassword = "$2b$12$JUF6YIV5mmrqrHyo1i6HxuIaVa4krr.vNHtYLzvbfZYvVYLq6mfbK"; // Replace with the password hash from your database
const plaintextPassword = "password123"; // Replace with the password you're testing

bcrypt.compare(plaintextPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error("Error comparing passwords:", err);
  } else {
    console.log("Password match:", isMatch); // Should print "true" if the password matches
  }
});
