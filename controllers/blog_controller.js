

const getAllArticles = async (req,res)=>{
res.status(200).json({msg:"All Articles"});
}

module.exports ={getAllArticles};