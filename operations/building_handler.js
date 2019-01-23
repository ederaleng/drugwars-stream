
var dbConnection = require('../lib/dbconn');
var player = require('./player_handler')

const building_handler = {
    AddLevelToPlayerBuilding:function (player, building_id, cb) {
        dbConnection.getConnection(function (err, connection) {
            var query = `SELECT * FROM character_buildings WHERE character_id=${player.character_id}`
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    cb(null)
                }
                else {
                    var buildings = result[0]
                    var building ={}
                    for (var i in buildings) {
                        if (i === 'building_' + building_id + '_level')
                        {
                            if(buildings[i]>0)
                            building.level = buildings[i]
                            else 
                            building.level = 1
                        }
                        if (i === 'building_' + building_id + '_last_update')
                        {
                            if(buildings[i])
                            building.last_update = buildings[i]
                            else{
                                building.last_update = new Date()
                            }
                        }

                    }
                    var query = "SELECT * FROM buildings"
                    connection.query(query, function (err, result) {
                        if (err) {
                            console.log(error)
                            cb(null)
                        }
                        var cbuildings = result
                        var timer = 900;
                        var cost = 100000000;
                        for (i = 0; cbuildings.length > i; i++) {
                            if (cbuildings[i].building_id === building_id) {
                                timer =  15 * (building.level * cbuildings[i].building_coeff)
                                var z = building.level * cbuildings[i].building_base_price
                                cost = (z*(building.level*cbuildings[i].building_coeff))
                                var type = cbuildings[i].cost_type
                                var ptype = cbuildings[i].production_type
                                if(cbuildings[i].production_rate > 0)
                                var prod_rate = (building.level*cbuildings[i].production_rate)+(((cbuildings[i].production_rate*(100+building.level))/100))
                                if(cost>player.drugs)
                                {
                                    connection.release()
                                    return cb('User doesnt have enough drugs')
                                }
                                else{
                                    var d = new Date();
                                    if(building.last_update< d)
                                    {
                                        console.log('next update' + building.last_update)
                                        var nowtomysql =  new Date().toISOString().slice(0, 19).replace('T', ' ')
                                        var query;
                                        if(ptype === 'weapons')
                                        {
                                            if(prod_rate)
                                            player.weapon_production_rate = player.weapon_production_rate + prod_rate
                                            player.drugs = player.drugs-cost
                                            query = "UPDATE `character` SET weapon_production_rate="+player.weapon_production_rate +", drugs="+player.drugs+" WHERE character_id="+player.character_id
                                        }
                                        else{
                                            if(prod_rate)
                                            player.drug_production_rate = player.drug_production_rate + prod_rate
                                            player.drugs = player.drugs-cost
                                            query = "UPDATE `character` SET drug_production_rate="+player.drug_production_rate+", drugs="+player.drugs+"  WHERE character_id="+player.character_id
                                        }                                
                                        connection.query(query, function (err, result) {
                                            if (err) throw err;
                                            else {
                                                var now = new Date(d.getTime() + (timer*1000)).toISOString().slice(0, 19).replace('T', ' ')
                                                var query = `UPDATE character_buildings SET building_${building_id}_level=${Number(building.level+1)}, building_${building_id}_last_update='${now}'  WHERE character_id=`+player.character_id
                                                connection.query(query, function (err, result) {
                                                    if (err) cb(err);
                                                    else {
                                                        console.log("Upgraded character building :" + building_id +  " for : " + player.character_id)
                                                        connection.release();
                                                        cb('success')
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else{
                                        cb('need to wait')
                                    } 
                                }
                            }
                        }
                      
                       
                    })
                }
            })
        })

    },
    AddLevelToPlayerBuildingSteem:function (player, building_id, amount, cb) {
        dbConnection.getConnection(function (err, connection) {
            var query = `SELECT * FROM character_buildings WHERE character_id=${player.character_id}`
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    cb(null)
                }
                else {
                    var buildings = result[0]
                    var building ={}
                    for (var i in buildings) {
                        if (i === 'building_' + building_id + '_level')
                        {
                            if(buildings[i]>0)
                            building.level = buildings[i]
                            else 
                            building.level = 1
                        }
                        if (i === 'building_' + building_id + '_last_update')
                        {
                            if(buildings[i])
                            building.last_update = buildings[i]
                            else{
                                building.last_update = new Date()
                            }
                        }

                    }
                    var query = "SELECT * FROM buildings"
                    connection.query(query, function (err, result) {
                        if (err) {
                            console.log(error)
                            cb(null)
                        }
                        var cbuildings = result
                        var timer = 900;
                        var cost = 100000000;
                        for (i = 0; cbuildings.length > i; i++) {
                            if (cbuildings[i].building_id === building_id) {
                                timer =  10
                                var z = building.level * cbuildings[i].building_base_price
                                cost = (z*(building.level*cbuildings[i].building_coeff))
                                var type = cbuildings[i].cost_type
                                var ptype = cbuildings[i].production_type
                                if(cbuildings[i].production_rate > 0)
                                var prod_rate = (building.level*cbuildings[i].production_rate)+(((cbuildings[i].production_rate*(100+building.level))/100))
                                console.log(player)
                                console.log(building_id)
                                console.log(amount)
                                if((cost/10000)>amount)
                                {
                                    connection.release()
                                    return cb('User doesnt have enough Steem')
                                }
                                else{
                                    var d = new Date();
                                    if(building.last_update< d)
                                    {
                                        console.log('next update' + building.last_update)
                                        var query;
                                        if(ptype === 'weapons')
                                        {
                                            if(prod_rate)
                                            player.weapon_production_rate = player.weapon_production_rate + prod_rate
                                            query = "UPDATE `character` SET weapon_production_rate="+player.weapon_production_rate +", WHERE character_id="+player.character_id
                                        }
                                        else{
                                            if(prod_rate)
                                            player.drug_production_rate = player.drug_production_rate + prod_rate
                                            query = "UPDATE `character` SET drug_production_rate="+player.drug_production_rate+", WHERE character_id="+player.character_id
                                        }                                
                                        connection.query(query, function (err, result) {
                                            if (err) throw err;
                                            else {
                                                var now = new Date(d.getTime() + (timer*1000)).toISOString().slice(0, 19).replace('T', ' ')
                                                var query = `UPDATE character_buildings SET building_${building_id}_level=${Number(building.level+1)}, building_${building_id}_last_update='${now}'  WHERE character_id=`+player.character_id
                                                connection.query(query, function (err, result) {
                                                    if (err) cb(err);
                                                    else {
                                                        console.log("Upgraded character building :" + building_id +  " for : " + player.character_id)
                                                        connection.release();
                                                        cb('success')
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else{
                                        cb('need to wait')
                                    } 
                                }
                            }
                        }
                      
                       
                    })
                }
            })
        })

    },
    checkForBuildingTime: function (id, level, cb) {
        dbConnection.getConnection(function (err, connection) {
            var query = "SELECT * FROM buildings"
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(error)
                    cb(null)
                }
                var buildings = result
                if(level<1)
                level=1
                for (i = 0; buildings.length > i; i++) {
                    if (buildings[i].building_id === id) {
                        connection.release()
                        cb(15 * (level * buildings[i].building_coeff))
                    }
                }
            })
        })
    },
    checkPlayerBuildingLevel: function (character_id, building_id, cb) {
       
    },
}
module.exports = building_handler;