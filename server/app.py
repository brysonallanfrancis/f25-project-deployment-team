from flask import Flask
from flask import request
from db import DB, create_db
create_db()
app = Flask(__name__)

@app.route("/players/<int:id>", methods=["OPTIONS"])
def preflight(id):
    return '', 204, {"Access-Control-Allow-Origin":"*",
                     "Access-Control-Allow-Methods":"PUT,DELETE",
                     "Access-Control-Allow-Headers":"Content-Type"}


@app.route("/players", methods = ["GET"])
def get_fantasy():
    db = DB("fantasy.db")
    fantasy = db.readAllRecords()
    return fantasy, 200, {"Access-Control-Allow-Origin":"*"}

@app.route("/players/<int:id>", methods = ["GET"])
def get_single_player(id):
    db = DB("fantasy.db")
    player = db.getPlayer(id)
    if player:
        return player, 200, {"Access-Control-Allow-Origin":"*"}
    else:
        return f"Cannot find {id}", 404, {"Access-Control-Allow-Origin":"*"}


@app.route("/players", methods = ["POST"])
def create_fantasy_player():
    db = DB("fantasy.db")
    d = {"name": request.form['name'],
         "position": request.form['position'],
         "points": request.form['points'],
         "team": request.form['team'],
        }
    #fantasy.append(d)
    db.saveRecord(d)
    return "Created", 201, {"Access-Control-Allow-Origin":"*"}

@app.route("/players/<int:id>", methods = ["DELETE"])
def delete_fantasy_player(id):
    db = DB("fantasy.db")
    player = db.getPlayer(id)
    if player:
        db.deleteRecord(id)
        return "Deleted", 200 ,{"Access-Control-Allow-Origin":"*"}
    else:
        return f"Cannot delete {id}", 404, {"Access-Control-Allow-Origin":"*"}


@app.route("/players/<int:id>", methods=["PUT"])
def update_fantasy_player(id):
    db = DB("fantasy.db")
    player = db.getPlayer(id)
    if not player:
        return f"Cannot edit {id}", 404, {"Access-Control-Allow-Origin":"*"}

    if 'field' in request.form and len(request.form) == 1:
        d = {"field": request.form['field']}
        db.updateStatus(id, d)
        return "Field updated", 200, {"Access-Control-Allow-Origin": "*"}
    
    d = {"name": request.form['name'],
         "position": request.form['position'],
         "points": request.form['points'],
         "team": request.form['team']
        }
    db.updateRecord(id,d)
    return "Edited", 200, {"Access-Control-Allow-Origin":"*"}


@app.errorhandler(404)
def not_found(e):
    return "Route not found", 404, {"Access-Control-Allow-Origin":"*"}


def main():
    app.run(host='0.0.0.0')
main()
