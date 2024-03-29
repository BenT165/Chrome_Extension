document.addEventListener("DOMContentLoaded", function() {
    // string representing the current time
    let time = "";

    // div with the clock
    let timer = document.getElementById("currentTime");

    // greeting for user
    let greeting = document.getElementById("myGreeting");

    // name within greeting div (editable part of the phrase)
    let name = document.getElementById("name");

    // whether or not to display seconds on the clock
    let precision = false;

    // button for generating quotes
    let quote_button = document.getElementById("quote_button");

    quote_button.addEventListener("click", generateQuote);

    function generateQuote() {
        fetch('https://api.quotable.io/random')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const quote = `"${data.content}"\n- ${data.author}`;
                var qu=document.getElementById("quote_text");
                qu.style.display="flex";
                qu.innerText = quote;
                
            })
            .catch(error => {
                console.log(error);
                document.getElementById('quote_text').innerText = 'An error occurred. Please try again later.';
            });
    }

    
    
        


//updates greeting to have most recent name of user
function restore_name(){
    chrome.storage.sync.get(['name'], function(result) {

        //update name if possible
        if(result != null){
            var current_name = result.name; //get most recent name
            name.innerText=current_name; //update the text inside of greeting to have the most recent name
            console.log("name restored");
        }
    });
}

restore_name();
timer.addEventListener("mouseover", toggle, false);
timer.addEventListener("mouseout", toggle, false);

greeting.addEventListener("dblclick", edit_name, false); 


//triggered when user tries to edit their name 
function edit_name(){

    //allow them to edit their name
    name.contentEditable="true"; 

    //create events that trigger when user is done editing
    document.addEventListener("click", click_off, false); 
    greeting.addEventListener("keydown", on_return, false);
};

//when user clicks off of name, save the new text in chrome storage
function click_off(event){

    //if user clicked outside of greeting box
    if(!greeting.contains(event.target)) {
        console.log("Clicked off of name");
        save_name();
    }
}

//save updated text if user hits return
function on_return(event){

    if(event.key == "Enter"){
        console.log("Hit return after editing name");
        save_name();
    }
}

//save name text in chrome storage
function save_name(textbox){

    //don't let user edit their name anymore
    name.contentEditable="false"; 

    //get rid of event listeners
    document.removeEventListener("click", click_off, false);
    greeting.removeEventListener("keydown", on_return, false);

    //update name
    var current_name = name.innerText;

    //save the updated name in chrome storage (part 1: id for element, part 2:)
    chrome.storage.sync.set({'name' : current_name}, function() {
        console.log("Name saved as " + current_name);
    });
}


function getTimeMinutes() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();

    hours = pad_zero(hours);
    minutes = pad_zero(minutes);

    time = hours + ":" + minutes;
    timer.textContent = time;
}

function getTimeSeconds() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    hours = pad_zero(hours);
    minutes = pad_zero(minutes);
    seconds = pad_zero(seconds);

    time = hours + ":" + minutes + ":" + seconds;
    timer.textContent = time;
}

// pad zeros before the time value if necessary
function pad_zero(val) {
    if (val < 10) {
        return val.toString().padStart(2, '0');
    } else {
        return val.toString();
    }
}

// figure out how to format the time
function decide() {
    if (precision == false) {
        getTimeMinutes();
    } else {
        getTimeSeconds();
    }
}

function toggle() {
    precision = !precision;
}

// get time every 1000 milliseconds
setInterval(decide, 1000);

});