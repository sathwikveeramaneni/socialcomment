// const Advisor = require('../model/advisor');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const post = require('../model/post');
const bcrypt = require('bcrypt');
const user = require('../model/user');

exports.register = async (req, res) => {
    const { name, email, password, gender } = req.body;
    const userExist = await User.findOne({email});
    
    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if(userExist) return res.status(400).send('Email already exists');
    
    try {
        const user = await User.create({ name, email, password: hashPassword,gender});
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.status(200).send({
            id: user._id
        });
    } catch(e) {
        res.sendStatus(400);
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });

    if(!user)  return res.status(400).send('email not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.sendStatus(401);

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    req.session.authtoken = token;
    res.status(200).send({
        token,
        id: user._id
    })
}

exports.likepost = async (req, res) => {


    const token = req.body.token;
    
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const { postId } = req.body;
    const postExist = await post.findOne({ _id: postId });
    if(!postExist) res.status(400).send("post Not exist with user ID");

    if(postExist) {
       const d=await  post.update(
            { _id: postId}, 
            { $push: { likes:verified._id } }
            
        );
        const postExist1 = await post.findOne({ _id: postId });  
        console.log(postExist1); 
        
        res.status(200).send("success");
    }
    
}

exports.createpost = async (req, res) => {
    const { posttittle, postcontent,tags } = req.body;

    const postExist = await post.findOne({ posttittle });
    if(postExist) res.status(400).send("post tittle not available");

    if(!postExist) {
        const Post=await post.create({ posttittle,postcontent,tags });
        console.log(Post);
        res.status(200).send({
            id: Post._id
        })
    }
} 

exports.allBookings = async (req, res) => {
    const { userId } = req.params;
    const userExist = await User.findOne({ _id: userId });
    if(!userExist) res.status(400).send("User Not exist with user ID");

    if(userExist) {
        const bookings = await Booking.find();
        const result = await Promise.all(bookings.map( async (e) => {
            const advisor = await Advisor.findOne({ _id: e.advisorId });
            return {
                "Advisor Name": advisor.advisorName,
                "Advisor Profile Pic": advisor.photoUrl,
                "Advisor Id": advisor._id,
                "Booking Time":  e.bookingTime,
                "Booking Id": e._id
            }
        }));
        res.status(200).send(result);
    }

} 


exports.comment = async (req, res) => {


    const token = req.body.token;
    
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const { postId ,comment} = req.body;
    const postExist = await post.findOne({ _id: postId });
    if(!postExist) res.status(400).send("post Not exist with user ID");
    console.log(comment);
    if(postExist) {
       const d=await  post.update(
            { _id: postId}, 
            { $push: { comments: {commen:comment,userid:verified._id}} }
            
        );
        const postExist1 = await post.findOne({ _id: postId });  
        console.log(postExist1); 
        res.status(200).send("success");
    }
    
}


exports.usercomments = async (req, res) => {
    const{userId} = req.body;
const userExist = await User.findOne({ _id: userId });
    if(!userExist) res.status(400).send("User Not exist with user ID");
if(userExist) {
        const postings= await post.find({comments: {$elemMatch: {userid:userId}}});
        const result = await Promise.all(postings.map( async (e) => {
            var comm= e.comments;
            var found=-1;
            for(var i=0; i<comm.length; i++) {
                if(comm[i].userid == userId) {
                    found=i;
                    break;
                }
            }
            
            return {
                "Comment": comm[found].commen,
                "post Name": e.posttittle,  
                  
            }
        }));
        res.status(200).send(result);
    }

} 


exports.getnamesandid = async (req, res) => {
var result3=new Array();
        const postings= await post.find();
        const result = await Promise.all(postings.map( async (e) => {
            var comm= e.likes;
            
            const result1 = await Promise.all(comm.map( async (p) => {
            const result2 = await User.findOne({_id: p});
                console.log(result2.name);
            result3.push(
            {

                "post name": e.posttittle,
                "user id":p,
                "user name":result2.name  
                  
            });
        }));

    }));
        res.status(200).send(result3);
    }

