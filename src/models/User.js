const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete") 

const UserScheme = new mongoose.Schema(
    {
        name: {type: String},
        age: {type: Number},
        email: {type: String,unique: true},
        password: {type: String },//Save the HASH
        interests: {type: [String], default:[]},
        allowsReceivingOffers: {type: Boolean},
        role: {type: String,enum: ["user", "admin"],default: "user"}
    },
    {
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})

module.exports = mongoose.model("Users", UserScheme) ;
