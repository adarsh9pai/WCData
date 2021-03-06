const express = require('express');
const api = express.Router();
const mysql = require('mysql');
const connectionCredentials = require('./connection.json');
let pool = mysql.createPool(connectionCredentials);

let returnValue = '';


getStartingLineup = (country, callback) => {
    let sqlStatement = "SELECT GAME.GameID, STARTING_LINEUPS.PlayerID, PLAYER.FIFA_Popular_Name FROM GAME INNER JOIN TEAM ON (TEAM.TeamID = GAME.TeamID1 OR TEAM.TeamID = GAME.TeamID2) AND TEAM.Team = '" + country +"' INNER JOIN STARTING_LINEUPS ON (STARTING_LINEUPS.GameID = GAME.GameID AND STARTING_LINEUPS.TeamID = TEAM.TeamID) INNER JOIN PLAYER ON STARTING_LINEUPS.PlayerID = PLAYER.PlayerID AND PLAYER.TeamID = TEAM.TeamID ORDER BY GAME.GameID, PLAYER.PlayerID;";
    pool.getConnection((error, connection) => {
        if(error){
            console.log(err);
            callback(true);
            return;

        }
        else{
            connection.query(sqlStatement, (error, results, fields) => {
                callback(false, results);
            })
            connection.release()


        }


    })
}

getCardHistory = (parameters, callback) => {
    let sqlStatement = "SELECT GAME.GameID, GAME.Team1_Score, GAME.Team2_Score, PLAYER.FIFA_Popular_Name, CARDS.Color_Card FROM GAME INNER JOIN TEAM ON (TEAM.TeamID = GAME.TeamID1 OR TEAM.TeamID = GAME.TeamID2) AND TEAM.Team = '" + parameters[0] + "' INNER JOIN CARDS ON (CARDS.GameID = GAME.GameID AND CARDS.TeamID = TEAM.TeamID) INNER JOIN PLAYER ON (PLAYER.PlayerID= CARDS.PlayerID AND PLAYER.TeamID = TEAM.TeamID) WHERE CARDS.Color_Card = '" + parameters[1] + "' ORDER BY GAME.GameID;";
    pool.getConnection((error, connection) => {
        if(error){
            console.log(err);
            callback(true);
            return;
        }
        else{
            connection.query(sqlStatement, (error, results, fields) => {
                callback(false, results);
            })
            connection.release()
        }
    })
}

api.get('/',(request,response)=>{
    response.json({message : "WCData API Endpoint"});
});

api.get('/startingLineup',(request, response)=>{
    getStartingLineup(request.query.team, (error, returnValue) => {
        response.json({message : "The Starting Lineup for " + request.query.team,
values : returnValue});
    })

})

api.get('/cardHistory',(request, response)=>{
    getCardHistory([request.query.team,request.query.color], (error, returnValue) => {
        response.json({message : request.query.color + " Card History for Team " + request.query.team,
values : returnValue});
    })

})

module.exports = api;
