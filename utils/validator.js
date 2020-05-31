module.exports = {

   user:(req, res)=>{

    req.assert('name', 'O nome é obrigatório.').notEmpty();
    req.assert('email', 'O e-mail está inválido.').notEmpty().isEmail();

    let err =  req.validationErrors();

    if (err){
     res.status(400).json({
     error: err 
   
   });
   return false;  
      
   }  else {
       
   return true;
     
   }
     


   }

};