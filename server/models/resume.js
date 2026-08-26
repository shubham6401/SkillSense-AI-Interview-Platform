const mongoose=require("mongoose");
const resumeSchema=new mongoose.Schema({
    originalName:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    resumeText:{
        type:String,
        required:true,
    },
    skills:[String],
    uploadedAt:{
        type:Date,
        default:Date.now,
    }
});
module.exports=mongoose.model("Resume",resumeSchema);