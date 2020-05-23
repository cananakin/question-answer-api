const bcrypt = require('bcryptjs')
const validationUserInput = (email, password) => {
    return email && password
}

const compareassword = (password, hassedPassword) => {
    return bcrypt.compareSync(password, hassedPassword)
}

module.exports = { validationUserInput, compareassword }