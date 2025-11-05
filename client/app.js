console.log("connected")
const roster_div = document.querySelector("#Roster")
const field_div = document.querySelector("#Field")
let edit_id = null;
let dragged_thing = null;
const boxes = document.querySelectorAll('.box');
const dropZones = document.querySelectorAll('.column');
let URL = "http://localhost:5000/players"


function load(){
    // blank out div first
    roster_div.innerHTML= "";
    let roster_header = document.createElement("h2")
    roster_header.innerHTML = "Roster";
    roster_div.appendChild(roster_header)
    document.getElementById("QB").innerHTML = "<h2>QB</h2>";
    document.getElementById("RB1").innerHTML = "<h2>RB</h2>";
    document.getElementById("RB2").innerHTML = "<h2>RB</h2>";
    document.getElementById("WR1").innerHTML = "<h2>WR</h2>";
    document.getElementById("WR2").innerHTML = "<h2>WR</h2>";
    document.getElementById("TE").innerHTML = "<h2>TE</h2>";
    document.getElementById("FLEX").innerHTML = "<h2>FLEX</h2>";
    document.getElementById("D").innerHTML = "<h2>D</h2>";
    document.getElementById("K").innerHTML = "<h2>K</h2>";
    reset_form();
    fetch(URL)
    .then(function(response){
        response.json()
            .then(function(data){
                console.log(data)
                data.forEach(player => load_players(player))
                calculateTotal();
            })
    })
}


// TODO: Set INLINE STYLE, CHANGE ARTICLE STYLE

function load_players(player){
    let div = document.createElement("article")
    let h3 = document.createElement("h3")
    let p = document.createElement("p")
    let p2 = document.createElement("p")
    let p3 = document.createElement("p")
    let del_button = document.createElement("button")
    if (player.field != null){
        let target_column = document.getElementById(player.field);
        if (target_column){
            target_column.append(div)
        }
        else{
            roster_div.append(div);
        }
        
    }else{
        roster_div.append(div)
    }
    div.append(h3)
    div.append(p)
    div.append(p2)
    div.append(p3)
    div.append(del_button)
    div.id=player.id
    console.log(div)
    div.draggable=true
    div.classList.add('box')
    div.addEventListener('dragstart', handleDragStart);
    h3.innerHTML = player.name
    p.innerHTML = player.position
    p2.innerHTML = player.team
    p3.innerHTML = player.points
    p3.classList.add("playerPoints")
    del_button.innerHTML = 'X'
    del_button.onclick = function(){
        let foo = confirm("Are you sure about that?");
        if (foo == true){
            deleteplayer(player.id)
        }
    }
    let edit_button = document.createElement("button")
    edit_button.innerHTML = "..."
    div.append(edit_button)
    edit_button.onclick = function(){editplayer(player)};

}

function addNewplayer(){
    //get form data
    let name = document.querySelector('#input_name').value
    let position = document.querySelector('#input_position').value
    let team = document.querySelector('#input_team').value
    let points = document.querySelector('#input_points').value

    console.log("the name is ",name)
    //prepare for api
    let data = "name="+encodeURIComponent(name)
    data +="&position="+encodeURIComponent(position)
    data +="&team="+encodeURIComponent(team)
    data +="&points="+encodeURIComponent(points)
    console.log(data);
    //send to api
    subit_method = "POST";
    url = URL;
    const button_text = document.querySelector("#submit_button").innerHTML;
    if (button_text == "Save"){
        subit_method = "PUT";
        url = URL+"/"+edit_id;
    }
    fetch(url,{ method:subit_method, body:data, headers: {"Content-Type": "application/x-www-form-urlencoded"}})
    .then(function(response){
        console.log("Saved")
        load()
    })
    //display
}

function deleteplayer(id){
    console.log("deleting player: ", id)
    //preflight
    

    //send to api
    fetch(URL+"/"+id,{ method:"DELETE", headers: {"Content-Type": "application/x-www-form-urlencoded"}})
    .then(function(response){
        console.log("Deleted")
        load()
    })

}

function editplayer(player){
    //get form data
    document.querySelector('#input_name').value = player.name
    document.querySelector('#input_position').value = player.position
    document.querySelector('#input_team').value = player.team
    document.querySelector('#input_points').value = player.points

    document.querySelector('#submit_button').innerHTML="Save"
    edit_id = player.id;
}

function reset_form(){
    document.querySelector('#input_name').value = ""
    document.querySelector('#input_position').value = ""
    document.querySelector('#input_team').value = ""
    document.querySelector('#input_points').value = ""

    document.querySelector('#submit_button').innerHTML="Submit"
}

let player_button = document.querySelector('#submit_button');
player_button.onclick = addNewplayer;
load()


function calculateTotal(){
    let total = 0;
//    p.innerHTML = ''


    let player_articles = document.querySelectorAll('#Field article')
    
    player_articles.forEach(article =>{
        let points_text = article.querySelector(".playerPoints").innerHTML;
        let points_value = parseFloat(points_text);


        if (!isNaN(points_value)) {
            total += points_value;
        }
    });

    let display = document.querySelector("#totalPoints p");
    if (!display) {
        display = document.createElement("p");
        document.querySelector("#totalPoints").append(display);
    }
    display.innerHTML = total;

}

boxes.forEach(e => {
    e.addEventListener('dragstart', handleDragStart);
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
});

function handleDragStart(e){
    dragged_thing = this;
    e.dataTransfer.setData('text/html', this.innerHTML)
}



function handleDragOver(e){
    if (e.preventDefault){
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}


function handleDrop(e){
    if (e.stopPropagation){
        e.stopPropagation();
    }
    
    if (dragged_thing !== null) {

        let player_position = dragged_thing.querySelector('p').innerHTML
        let column_id = this.id
        let column_position = this.dataset.position

        
        
        let valid = false;
        if(column_id === "Roster"){
            valid = true;
        }
        if (column_position === "FLEX" && ["RB", "WR"].includes(player_position)) {
            valid = true;
        }

        if(column_position === player_position){
            valid = true;
        }


        if(valid){
            this.appendChild(dragged_thing);
            dragged_thing.addEventListener('dragstart',handleDragStart);
            let field_api = null;
            let id = dragged_thing.id
            
            if(this.id === "Roster"){
                field_api = null
            } else {
                field_api = column_id;
            }
            
            let data = "field=" + encodeURIComponent(field_api);
            
            fetch(URL+"/"+id,{ method:"PUT", body:data, headers: {"Content-Type": "application/x-www-form-urlencoded"}})
            .then(function(response){
                console.log("Status Changed")
            })

            calculateTotal();
            
        }

    }
    return false;
}



