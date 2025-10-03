const Listing = require("../models/Listing.js");
const wrapAsync = require("../Utils/asyncWrap.js");

module.exports.index = async(req,res)=>
{  
   const allListing = await Listing.find({});
   res.render("listings/index.ejs" ,{ allListing })
};

module.exports.newFrom = (req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing =  wrapAsync(async(req, res)=>{
    
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path:"reviews" , 
        populate:{
        path:"author",},}).populate("owner");
        
    if(!listing){
        // throw(new ExpressError(404, "Id not found in Database"));
        req.flash("error" , "Listing is not found in the database!");
        return res.redirect(`/listings`);

    }
    res.render("listings/show.ejs" , {listing});
})

module.exports.createListing = async(req,res)=>{
  

   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image={url:req.file.path , filename:req.file.filename};
   await newListing.save();
   req.flash("success" ,"New Listing Created!");
   res.redirect("/listings");
}

module.exports.editListing = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        // throw(new ExpressError(404, "Id not found in Database"));
        req.flash("error" , "Listing is not found in the database!");
        return res.redirect(`/listings`);
    }
    let OriginalImage = listing.image.url;
    console.log(OriginalImage);
    OriginalImage = OriginalImage.replace("/upload" , "/upload/w_200");
    console.log(OriginalImage);
    res.render("listings/edit.ejs",{listing, OriginalImage});
}

module.exports.updateListing = async(req,res)=>{
    let {id}= req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
      
        listing.image={url:req.file.path , filename:req.file.filename};
        await listing.save();
    }
    req.flash("success" ,"Listing is Edited successfully!");

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =  wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" ,"Listing is Deleted successfully!");
    res.redirect("/listings");
});