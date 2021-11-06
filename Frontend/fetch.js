const postE = document.getElementById('post-event');
const postD = document.getElementById('post-dining');

const url = 'https://kfpdqk0mz7.execute-api.us-west-2.amazonaws.com';

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        lastResult = decodedText;
        
        console.log(`Code matched = ${decodedText}`, decodedResult);
    }
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
/* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess);


async function sha256(ID) {
    // hash the message AND encode as UTF-8
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ID));

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

const sendDining = () => {

    axios.post(url +
        '/checkDiningHallBalance',
        {
            "userHash": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    )
        .then(response => {
            // console.log(response);
            console.log("Location: Barrett's Dining Hall\n")
            if (response.data[0].E === 200) {
                console.log("Name: " + response.data[0].Name);
                console.log("Meal Swipes Left: " + response.data[0].SwipesLeft);
                console.log("\n Welcome! Today's special includes Chicken Parmesan, Paneer Masala and Poke Bowls")
            }
        })
        .catch(err => {
            console.log(err, err.response);
        });
};

const sendEvent = () => {
    let eventType = 'Club Event'
    axios.post(url +
        '/allowedToEnter',
        {
            "userHash": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
            "event": eventType // Sport Event, Club Event, SDFC
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    )
        .then(response => {
            // console.log(response);
            console.log('Welcome to ASU ' + eventType + '\n')
            console.log("Name: " + response.data[0].name);
            if (response.data[0].E === 200) { // 200 code stands for successful response
                if (response.data[0].Vaccinated == true) { // checking if the user is vaccinated or not
                    console.info("Access Allowed. Enjoy your event!")
                } else {
                    console.info("You don't fulfill the event requirments to enter in. Please check your MY ASU app for more information.");
                }
            } else if (response.data[0].E === 407) { // 407 code stands for not allowed into this specific-event
                console.log("Don't have access to this event. Check the front desk.")
            } else {
                console.log("User not found. Please try again or check with the front desk.")
            }
        })
        .catch(err => {
            console.log(err, err.response);
        });
};

postE.addEventListener('click', sendDining);
postD.addEventListener('click', sendEvent);