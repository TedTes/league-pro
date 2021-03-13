const express=require('express');
const app=express();

const csv = require('csv-parser');
const fs = require('fs');
const multer=require('multer');
const readline=require('readline');


function readFile(res){
 return new Promise((resolve,reject)=>{
      let matrix=[];
      const readInterface = readline.createInterface({
        input: fs.createReadStream('./uploads/matrix.csv'),
    });
 
     readInterface.on('line', (line)=>{
          line=line.split(',').map(num=>+num);
          matrix.push(line);
    });
    readInterface.on('close',(data)=>{
  if (matrix.length===0 || matrix.length !== matrix[0].length)
    res.send("Error:the file doesn't contain  square matrix")
  else resolve(matrix);
    })
    });
}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) //Retains the original file name
    }
  })
  const upload = multer({ storage: storage })

app.listen(3000,()=>{
    console.log(`server started on port 3000`);
})

app.get('/',(req,res)=>{
     res.send("hell0")
})
app.post('/',(req,res)=>{
  res.send("hell0");
})
app.post('/echo',upload.single('file'),(req,res)=>{
      readFile(res).then((matrix)=>{
      var data='';
       for(let i=0;i<matrix.length;i++){
          data=data + matrix[i] +'\n'
       }
      res.send(data.trim());
     });
})

app.post('/sum',upload.single('file'),(req,res)=>{
  readFile(res).then((matrix)=>{
    var sum=0;
    for(let i=0;i<matrix.length;i++){
      for(let j=0;j<matrix.length;j++){
       sum=sum + matrix[i][j];
      }
    }
    res.send(sum.toString());
  });
})
app.post('/multiply',upload.single('file'),(req,res)=>{
 
  readFile(res).then((matrix,data)=>{
    var multiplyResult=1;
    for(let i=0;i<matrix.length;i++){
      for(let j=0;j<matrix.length;j++){
       multiplyResult=multiplyResult * matrix[i][j];
      }
    }
    res.send(multiplyResult.toString()); 
})

});

app.post('/flatten',upload.single('file'),(req,res)=>{
  readFile(res).then((matrix)=>{
    var data='';
     for(let i=0;i<matrix.length;i++){
        data=data + matrix[i] +','
     }
    res.send(data.slice(0,-1));
   });
})

app.post('/invert',upload.single('file'),(req,res)=>{
  readFile(res).then(matrix=>{
    let data='';
    for(let i=0;i<matrix.length/2;i++){
      for(let j=1;j<matrix.length;j++){
      let temp=matrix[i][j];
       matrix[i][j]=matrix[j][i];
       matrix[j][i]=temp;
      }
    }
  for(let i=0;i<matrix.length;i++){
      data=data + matrix[i] +'\n'
   }
    res.send(data.trim());
  });
})





