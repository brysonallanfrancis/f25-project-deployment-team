# f25-resourceful-brysonallanfrancis
## Resource

Football Players

Attributes:
    - name (string)
    - position (string)
    - team (string)
    - points (float)
    - field (string)

## Schema

```sql
CREATE TABLE fantasy (
    id INTEGER PRIMARY KEY,
    name TEXT,
    position TEXT,
    team TEXT,
    points DECIMAL(5,2),
    field TEXT);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve player collection     | GET    | /players
Retrieve player member         | GET    | /players/*\<id\>*
Create player member           | POST   | /players
Update player member           | PUT    | /players/*\<id\>*
Delete player member           | DELETE | /players/*\<id\>*
