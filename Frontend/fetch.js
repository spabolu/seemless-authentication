const url = 'https://pokeapi.co/api/v2/pokemon/1'

const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');

const getData = () => {
    axios.get("https://pokeapi.co/api/v2/pokemon/1")
        .then(response => {
            console.info(response)
            console.info("Pokemon Name: " + response.data.name);
        })
        .catch(err => {
            console.error(err);
        })
};

// const sendData = () => {
//     axios.post(
//         'https://kfpdqk0mz7.execute-api.us-west-2.amazonaws.com/checkDiningHallBalance',
//         {
//             "userHash": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
//             "EventName": "Football"
//         },
//         {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*'
//             }
//         }
//     )
//         .then(response => {
//             //console.log(response.data);
//             if (response.data[0].E === 200) {
//                 console.log("Name: " + response.data[0].Name);
//                 console.log("Meal Swipes: " + response.data[0].SwipesLeft);
//                 //console.log(response.data[0].CORONA);
//             }
//         })
//         .catch(err => {
//             console.log(err, err.response);
//         });
// };

const sendData = () => {
    axios.post(
        'https://kfpdqk0mz7.execute-api.us-west-2.amazonaws.com/allowToEnter',
        {
            "userHash": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
            "EventName": "Football"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    )
        .then(response => {
            //console.log(response.data);
            if (response.data[0].E === 200) {
                // console.log("Name: " + response.data[0].Name);
                // console.log("Meal Swipes: " + response.data[0].SwipesLeft);
                console.log("POST Success, baby!")
            }
        })
        .catch(err => {
            console.log(err, err.response);
        });
};

getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);