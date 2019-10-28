const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host :'localhost',
    user :'root',
    password : '',
    database :  'produtosdb',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
   if(!err) {
       console.log('Conexao com banco bem sucedida');
   } else{
       console.log('Conexao com banco falhou \n Error : '+ JSON.stringify(err, undefined, 2));
   }
});

app.listen(3000,()=>console.log('Express server is running at port no: 3000'));


//get all produtos
app.get('/produto', (req, res)=>{
    mysqlConnection.query('SELECT * FROM produto', (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }else {
            console.log(err);
        }
    })
});

//get um produtos
app.get('/produto/:id', (req, res)=>{
    mysqlConnection.query('SELECT * FROM produto WHERE id = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }else {
            console.log(err);
        }
    })
});

//delete um produto
app.delete('/produto/:id', (req, res)=>{
    mysqlConnection.query('DELETE FROM produto WHERE id = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            res.send('Deletado com sucesso');
        }else {
            console.log(err);
        }
    })
});

/* USE `produtosdb`;
DROP procedure IF EXISTS `ProdutoAddOrEdit`;

DELIMITER $$
USE `produtosdb`$$
CREATE PROCEDURE `ProdutoAddOrEdit` (

IN _id INT,
IN _nome varchar(45),
IN _valor decimal(8,2)

)

BEGIN
	IF _id = 0 THEN
		INSERT INTO  produto(nome, valor) VALUES (_nome, _valor);
        
        SET _id = LAST_INSERT_ID();
	ELSE
		UPDATE produto SET nome = _nome, valor = _valor WHERE id = _id;
	END IF;
    
    SELECT _id AS 'id';
END$$

DELIMITER ;*/ 

//insert um produto
app.post('/produto', (req, res)=>{
    let prod = req.body;
    var sql = "SET @id = ?; SET @nome = ?; SET @valor = ?; \
    CALL ProdutoAddOrEdit(@id, @nome @valor);";
    mysqlConnection.query(sql, [prod.id, prod.nome, prod.valor], (err, rows, fields)=>{
        if(!err){
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Produto inserido id : '+element[0].id);
            });
        }else {
            console.log(err);
        }
    })
});

//update um produto
app.put('/produto', (req, res)=>{
    let prod = req.body;
    var sql = "SET @id = ?; SET @nome = ?; SET @valor = ?; \
    CALL ProdutoAddOrEdit(@id, @nome @valor);";
    mysqlConnection.query(sql, [prod.id, prod.nome, prod.valor], (err, rows, fields)=>{
        if(!err){
            res.send('Atualizado com sucesso.');
        }else {
            console.log(err);
        }
    })
});