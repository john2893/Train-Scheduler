
$( document ).ready(function() {
    // Initialize Firebase
    // This is the code we copied and pasted from our app page
    var config = {
    apiKey: "AIzaSyDL71jNikOLXa5OS2M7S9psde0xWsblh3c",
    authDomain: "fir-class-1ddba.firebaseapp.com",
    databaseURL: "https://fir-class-1ddba.firebaseio.com",
    projectId: "fir-class-1ddba",
    storageBucket: "fir-class-1ddba.appspot.com",
    messagingSenderId: "843020786539"
    };


    firebase.initializeApp(config);

    // Variables
    // ================================================================================

    // Get a reference to the database service
    var database = firebase.database();
    var trainName; 
    var destination;
    var frequency;
    var nextArrival;
    var minutesAway;
    var fristTrain;
    var now = moment();



    $("#add-train").on("click", function(e){
        e.preventDefault();
        
        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        
        firstTrain = $("#first-train-input").val().trim();
        console.log(firstTrain);
        now = moment().format('X');
        frequency = $("#frequency-input").val().trim();
    
        database.ref().push({  // adds into db
            trainName:trainName,
            destination:destination,
            firstTrain:firstTrain,
            frequency:frequency,
            time:now,
        });
        //clear input fields after submit button
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
    });

    // Tried to work on auto updating the minutes away field.
    function autoTimeChange(){
        database.ref().on('value', function(snapshot){
            snapshot.forEach(function(snapshot){
                now = moment().format('X');
                console.log(snapshot.val());
              
                database.ref().update({
                time:now,
                });
            });
        });
    };
    // setInterval(autoTimeChange, 10000);
    //======================================================


    database.ref().on('child_added', function(snapshot) {
      
 
        console.log(snapshot.key);
        var data = snapshot.val();
        console.log(data.trainName);
        console.log(data.destination);
        console.log(data.firstTrain);
        console.log(data.frequency);
        frequency = data.frequency;
        firstTrain = data.firstTrain;
        var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log("con "+ firstTrainConverted);
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log(diffTime);

        //minutes away
        var away = diffTime % frequency;
        console.log(away);

        var minsTillTrain = frequency - away;
        console.log(minsTillTrain);
        //next train
        var nextArrival1 = moment().add(minsTillTrain, "minutes");
        nextArrival= (moment(nextArrival1).format("hh:mm"));

        // Change time automatically.
       

        // Output to the Table
        var rowLine = $("<tr>").append(
            $("<td>").text(data.trainName),
            $("<td>").text(data.destination),
            $("<td>").text(data.frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minsTillTrain),
        
        );
        $("#employee-table").append(rowLine);

        // console.log(snapshot);
    }, function(errorObject) {
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });

    $(document).on("click",".delete", function(){
        alert("delete");
    });
    $(document).on("click",".update", function(){
        alert("update");
    });




});