import sqlite3
def dict_factory(cursor, row):
    fields = []
    # Extract column names from cursor description
    for column in cursor.description:
       fields.append(column[0]) 
    # Create a dictionary where keys are column names and values are row values
    result_dict = {}
    for i in range(len(fields)):
       result_dict[fields[i]] = row[i]  
    return result_dict

class DB:
    def __init__(self,db_filename):
        self.db_filename = db_filename
        self.connection = sqlite3.connect(db_filename)
        self.cursor = self.connection.cursor()
        
    def readAllRecords(self):
        self.cursor.execute("SELECT * FROM fantasy")
        rows = self.cursor.fetchall()
        all = []
        for row in rows:
            d = dict_factory(self.cursor,row)
            all.append(d)
        return all

    def getPlayer(self,id):
        self.cursor.execute("SELECT * FROM fantasy WHERE id=?",[id])
        record = self.cursor.fetchone()
        return dict_factory(self.cursor,record)        


    def saveRecord(self,record):
        data = [record['name'],record['position'],record['points'],record['team']]
        self.cursor.execute("INSERT INTO fantasy (name, position, points, team) VALUES(?,?,?,?);",data)
        self.connection.commit() #actually saves modification

    def deleteRecord(self,id):
        self.cursor.execute("DELETE FROM fantasy WHERE id=?;",[id])
        self.connection.commit()

    def updateRecord(self,id,record):
        data = [record['name'],record['position'],record['points'],record['team'],id]
        self.cursor.execute("UPDATE fantasy SET name=?, position=?, points =?, team =?, field =NULL WHERE id=?;",data)
        self.connection.commit()

    def updateStatus(self,id,record):
        data = [record['field'], id]
        self.cursor.execute("UPDATE fantasy SET field =? WHERE id=?;",data)
        self.connection.commit()

    def close(self):
        self.connection.close()

if __name__ == '__main__':
    db = DB("fantasy.db")
    db.read_all_records()
    db.save_record(1)
    db.read_all_records()
    db.close()

#cursor.execute("SELECT * FROM trails")
#rows = cursor.fetchall()
#print("the rows are, ", rows)
