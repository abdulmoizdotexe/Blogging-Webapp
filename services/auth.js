const jwt = require('jsonwebtoken');
const secret = "12345678";
function createToken(user){
    const payload = {
        _id: user._id,
        FullName: user.FullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role
    }

    const token = jwt.sign(payload, secret);

    return token;
}

function checkToken(token){
    const payload = jwt.verify(token, secret);

    return payload;
}

module.exports={
    createToken,
    checkToken,
}