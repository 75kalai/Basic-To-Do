const express = require('express');
const mysqlDesc = require('./mysql_utils/mysqlDescription');
const mysqlConnection = require('./mysql_utils/mysqlConnection');
require('dotenv').config()
const cors = require("cors");
var path = require("path");


const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());


app.use(function (req, res, next) {
    var filename = path.basename(req.url);
    var extension = path.extname(filename);
    if (extension === '.css')
        console.log("STATIC", Date());
    next();
});
app.use(express.static('public'))

app.get("/",(req,res)=>{
    console.log("STATIC:",Date())
    res.send("hello world");
})

app.get("/getData",async (req,res)=>{
    console.log("GET:",Date())
    let result = await mysqlConnection.getRows( mysqlDesc.TABLE_USERDATA.__TABLE_NAME, "*" );
    res.send( constructSuccessResponse(result) );
})

app.post("/addData", async (req, res)=>{
    console.log("ADD : ",Date(),req.body.name, req.body.date, req.body.status);
    let result = await mysqlConnection.insertRow( 
        mysqlDesc.TABLE_USERDATA.__TABLE_NAME, 
        [ mysqlDesc.TABLE_USERDATA.NAME, mysqlDesc.TABLE_USERDATA.DATE, mysqlDesc.TABLE_USERDATA.STATUS ],
        [ req.body.name, req.body.date, req.body.status ]
    );
    if(result.affectedRows==1){
        res.send( constructSuccessResponse("User "+req.body.name+" added succesully. User ID:"+result.insertId) );
    }else{
        res.send( constructErrorResponse("Operation failed, user not added") );
    }
});

app.post("/updateData", async (req,res)=>{
    // let result = await mysqlConnection.updateRows( 
    //     mysqlDesc.TABLE_USERDATA.__TABLE_NAME,
    //     mysqlDesc.TABLE_USERDATA.ID+"="+req.body.id,
    //     [ mysqlDesc.TABLE_USERDATA.NAME, mysqlDesc.TABLE_USERDATA.DATE, mysqlDesc.TABLE_USERDATA.STATUS ],
    //     [ req.body.name, req.body.date, req.body.status ]
    // );
    console.log("UPDATE : ",Date(), req.body.id, req.body.name, req.body.date, req.body.status);
    let result = await mysqlConnection.executeQuery( `update userdata set name=?,date=?,status=? where id=?`, [req.body.name, req.body.date, req.body.status, req.body.id] );
    if(result.affectedRows==1){
        res.send( constructSuccessResponse("User "+req.body.name+" updated succesully.") );
    }else{
        res.send( constructErrorResponse("Operation failed, user not added") );
    }
})

app.delete("/deleteData", async (req, res)=>{
    console.log("DELETE : ",Date(), req.query.id );
    let result = await mysqlConnection.executeQuery("delete from userdata where ID=?",req.query.id);
    res.send( constructSuccessResponse("User deleted successfully") );
})

app.listen(process.env.PORT, ()=>{
    console.log("server started at "+process.env.SITE_URL+process.env.PORT)
})

function constructSuccessResponse( data ){
    let response = {
      status : "success",
      code: 0,
      data: (typeof data === 'object' ? data : {message:data} )
    }
    return response;
  }
  
  function constructErrorResponse( data, errorCode=-1 ){
    let response = {
      status : "error",
      code: errorCode,
      data: (typeof data === 'object' ? data : {message:data} )
    }
    return response;
  }