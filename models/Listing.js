const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./Review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{
        url:String,
        filename:String,      
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review" // use when we have to populate this thing
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
    }
})
//Mongoosh middleware

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
       await Review.deleteMany({_id:{$in: listing.reviews}})
    }
})


const Listing = mongoose.model("Listing" , listingSchema);



module.exports = Listing;