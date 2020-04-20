module.exports = (app) => {
    
    // Register a member
    app.post('/registerMember', (req,res) => {

        //checking if member is found in the db already
        Member.findOne({username:req.body.username}, (err,memberResult)=> {
            if (memberResult){
                res.send('Members name is already taken. Please choose another name');
            } else{
                const hash = bcryptjs.hashSync(req.body.password); //hash the password
                const member = new Member({
                _id : new mongoose.Types.ObjectId,
                username : req.body.username,
                email : req.body.email,
                password : hash,
                about : req.body.about,
                location : req.body.location,
                website : req.body.website
                });
        
                member.save().then(result => {
                // security measures
                res.send('Your account has been created, please login to activate your account');
                }).catch(err => res.send(err));
            }
        });
    });
  
    // Get all members
    app.get('/allMembers', (req,res) => {
        Member.find().then(result => {
        res.send(result);
        });
    });
  
    // Login a member
    app.post('/loginMember', (req,res) => {
        Member.findOne({username:req.body.username},(err,memberResult) => {
        if (memberResult){
            if (bcryptjs.compareSync(req.body.password, memberResult.password)){
            res.send(memberResult);
            } else {
            res.send('Not Authorized');
            }
        } else {
            res.send('Member not found. Please register');
        }
        });
    });

}