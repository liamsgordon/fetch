const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "L1am1521!@",
    database: "user_system",
    });


app.post('/create', (req, res) => {

        const name = req.body.name
        const datetime = req.body.datetime
        const Points = req.body.Points
        

        db.query("INSERT INTO users (name, datetime, Points) VALUES (?,?,?)", 
        [name, datetime, Points], 
        (err, result) => {
            if (err) {
                if (err.errno == 1062) {
                    db.query(
                        "UPDATE users SET Points = Points+?,datetime = ? WHERE name = ?",
                        [Points, datetime, name],
                        (err, result) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.send(result);
                          }
                        }
                      );
                } else {
                    console.log(err)
                }
            } else {
                res.send("Values inserted")
                }
            }
        );
});

app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

app.post("/subtract", (req, res) => {

    const PointsSub = req.body.PointsSub

    db.query('SELECT * FROM users ORDER BY datetime ASC', function(err, rows, fields) {
        if (err) throw err;

        
        WhatisLeft = PointsSub;
        for (var i = 0; i < rows.length; i++) {
               //obj = whatever field its currently on (name, email, w/e)
               if (WhatisLeft > rows[i].points) {
                WhatisLeft = WhatisLeft-rows[i].points;
                db.query(
                    "UPDATE users SET Points = ? WHERE name = ?",
                    [0, rows[i].Name],
                    (err, result) => {
                      if (err) {
                        console.log(err);
                      }
                    }
                  );
               } else {
                console.log(WhatisLeft);
                db.query(
                    "UPDATE users SET Points = Points-? WHERE name = ?",
                    [WhatisLeft, rows[i].Name],
                    (err, result) => {
                      if (err) {
                        console.log(err);
                      } else {
                        //res.send(result);
                        return;
                      }
                    }
                );
                WhatisLeft = 0;
               }
          };
    });
});


app.listen(3001, ()=> {
    console.log("your server is up")
});
