const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  posttittle: {
    type: String,
    required: true
  },
  postcontent: {
    type: String,
    required: true
  },
  likes:[Schema.Types.ObjectId],
  dislikes:[Schema.Types.ObjectId],
  comments:[
    {
      commen: {type:String},
      userid: {type:Schema.Types.ObjectId}
    }
  ],
  tags:
  {
    type:String,
    required:true
  }

  
});

module.exports = mongoose.model('post', postSchema);
