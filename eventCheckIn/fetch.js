// const postE = document.getElementById('post-event');
// const postD = document.getElementById('post-dining');

const url = 'https://kfpdqk0mz7.execute-api.us-west-2.amazonaws.com';
let encryptedID = '';
let lastResult = '0';

function onScanSuccess(decodedText, decodedResult) {
	// console.log(`Code matched = ${decodedText}`, decodedResult);
	if (decodedText != lastResult) {
		lastResult = decodedText;

		console.log(`Code matched = ${decodedText}`, decodedResult);
		const myPromise = new Promise((resolve) => {
			resolve(encryptedID = sha256(decodedText));
		})
		myPromise
			// .then(sendDining(encryptedID));
			.then(sendEvent(encryptedID));
		//console.log(typeof sha256(decodedText));
		//encryptedID = sha256(decodedText);
	}
}

function onScanFailure(error) {
	// handle scan failure, usually better to ignore and keep scanning.
	// for example:
	console.warn(`Code scan error = ${error}`);
}

let html5QrcodeScanner = new Html5QrcodeScanner(
	"qrInterface", {
		fps: 10,
		qrbox: {
			width: 300,
			height: 300
		}
	},
	/* verbose= */
	false);
html5QrcodeScanner.render(onScanSuccess);


function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value >>> amount) | (value << (32 - amount));
	};

	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty] * 8;

	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
			k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
		}
	}

	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j >> 8) return; // ASCII check: only accept characters in range 0-255
		words[i >> 2] |= j << ((3 - i) % 4) * 8;
	}
	words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
	words[words[lengthProperty]] = (asciiBitLength)

	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);

		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15],
				w2 = w[i - 2];

			// Iterate
			var a = hash[0],
				e = hash[4];
			var temp1 = hash[7] +
				(rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+
				((e & hash[5]) ^ ((~e) & hash[6])) // ch
				+
				k[i]
				// Expand the message schedule if needed
				+
				(w[i] = (i < 16) ? w[i] : (
					w[i - 16] +
					(rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
					+
					w[i - 7] +
					(rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
				) | 0);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+
				((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

			hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1) | 0;
		}

		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i]) | 0;
		}
	}

	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i] >> (j * 8)) & 255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};

const sendDining = (encryptedID) => {
	const x = setTimeout(() => {
		document.getElementById("name").innerHTML = 'Waiting to be scanned...';
		document.getElementById("swipes").innerHTML = '';
		document.getElementById("msg").innerHTML = '';
	}, 5000);
	let msg = '';
	axios.post(url +
			'/checkDiningHallBalance', {
				"userHash": encryptedID
			}, {
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
				let name = response.data[0].Name;
				let swipes = response.data[0].SwipesLeft;

				// console.log("Name: " + name);
				document.getElementById("name").innerHTML = name;

				if (swipes != 0) {
					// console.log("Meal Swipes Left: " + swipes);
					document.getElementById("swipes").innerHTML = 'Swipes Left: ' + swipes;

					msg = "Today's special includes Spicy Chicken, Paneer Masala and Poke Bowls"
					// console.log(msg)
					document.getElementById("msg").innerHTML = msg;

				} else {
					document.getElementById("swipes").innerHTML = 'You have zero swipes! Get outta here!';
				}

				x();
			}
		})
		.catch(err => {
			console.log(err, err.response);
		});
};

const sendEvent = (encryptedID) => {
	let eventType = 'SDFC'; // Sport Event, Club Event, SDFC)

	console.log("userHash: " + encryptedID + "\n" +
		"event: " + eventType)

	const x = setTimeout(() => {
		document.getElementById("name").innerHTML = 'Waiting to be scanned...';
		document.getElementById("event").innerHTML = '';
		document.getElementById("msg").innerHTML = '';
	}, 5000);
	axios.post(url +
			'/allowedToEnter', {
				"userHash": encryptedID,
				"event": eventType // Sport Event, Club Event, SDFC
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			}
		)
		.then(response => {
			// console.log(response);
			console.log('Welcome to ASU ' + eventType + '\n');
			document.getElementById('event').innerHTML = "Welcome to ASU " + eventType;

			console.log("Name: " + response.data[0].name);
			document.getElementById('name').innerHTML = "Name: " + response.data[0].name;
			if (response.data[0].E === 200) { // 200 code stands for successful response
				if (response.data[0].Vaccinated == true) { // checking if the user is vaccinated or not
					console.info("Access Allowed. Enjoy your event!")
					document.getElementById("msg").innerHTML = "Access Allowed. Enjoy your event!"
				} else {
					console.info("You don't fulfill the event requirments to enter. Check MY ASU app for more information.");
					document.getElementById("msg").innerHTML = "You don't fulfill the event requirments to enter. Check MY ASU app for more information."
				}
			} else if (response.data[0].E === 407) { // 407 code stands for not allowed into this specific-event
				console.log("You are not registered for this event. Please register at the front desk.")
				document.getElementById("msg").innerHTML = "You are not registered for this event. Please register at the front desk."
			} else {
				console.log("User not found. Please try again or check with the front desk.")
				document.getElementById("msg").innerHTML = "User not found. Please try again or check with the front desk."
				x();
			}

		})
		.catch(err => {
			console.log(err, err.response);
		});
};

// postE.addEventListener('click', sendDining);
// postD.addEventListener('click', sendEvent);