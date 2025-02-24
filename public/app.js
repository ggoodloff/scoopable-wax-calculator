let useGrams = false;
function toggleUnits() {
    useGrams = !useGrams;
    document.querySelector("button[onclick='toggleUnits()']").innerText = useGrams ? "Switch to Ounces" : "Switch to Grams";
    calculateWax();
}

function toggleInput(activeInput) {
    let fragranceField = document.getElementById('fragranceOil');
    let outputField = document.getElementById('outputVolume');
    
    if (activeInput === 'fragranceOil' && fragranceField.value) {
        outputField.value = '';
        outputField.disabled = true;
    } else if (activeInput === 'outputVolume' && outputField.value) {
        fragranceField.value = '';
        fragranceField.disabled = true;
    } else {
        fragranceField.disabled = false;
        outputField.disabled = false;
    }
}

function calculateWax() {
    let conversionFactor = useGrams ? 28.3495 : 1;
    let fragranceOil = parseFloat(document.getElementById('fragranceOil').value) || 0;
    let outputVolume = parseFloat(document.getElementById('outputVolume').value) || 0;
    let wax, mineralOil, fragrance, mica, dye, totalOutput;

    if (fragranceOil > 0) {
        totalOutput = (fragranceOil / 0.20);
        let totalBase = totalOutput * 0.80;
        wax = ((4 / 7) * totalBase);
        mineralOil = ((3 / 7) * totalBase);
        fragrance = fragranceOil;
    } else {
        totalOutput = outputVolume;
        let totalBase = outputVolume * 0.80;
        wax = ((4 / 7) * totalBase);
        mineralOil = ((3 / 7) * totalBase);
        fragrance = (totalOutput * 0.20);
    }
    
    if (useGrams) {
        totalOutput *= conversionFactor;
        wax *= conversionFactor;
        mineralOil *= conversionFactor;
        fragrance *= conversionFactor;
    }
    
    mica = "mica pigment (for shimmer)";
    dye = "add color as desired";
    
    let unit = useGrams ? "g" : "oz";
    let instructions = `<p><strong>Total Output Volume:</strong> ${totalOutput.toFixed(2)} ${unit}</p>
        <p><strong>Ingredients:</strong></p>
        <p>${wax.toFixed(2)} ${unit} Wax<br>
        ${mineralOil.toFixed(2)} ${unit} Mineral Oil<br>
        ${fragrance.toFixed(2)} ${unit} of your preferred essential or fragrance oils<br>
        ${mica}<br>
        ${dye}</p>
        <h3>Instructions:</h3>
        <ol>
        <li>Melt ${wax.toFixed(2)} ${unit} of Wax in a double boiler to approximately 185°F (85°C).</li>
        <li>Remove from heat and ${dye}. Stir thoroughly.</li>
        <li>Add ${fragrance.toFixed(2)} ${unit} of fragrance oil and mix well.</li>
        <li>Pour in ${mineralOil.toFixed(2)} ${unit} of Mineral Oil and stir continuously.</li>
        <li>Introduce ${mica} and mix well.</li>
        <li>Pour into 4 oz plastic jars or containers at or below 129°F (54°C).</li>
        <li>Let cure for 48 hours before use.</li>
        </ol>
        <p>Your scoopable wax melts are now ready for use!</p>`;

    document.getElementById('output').innerHTML = instructions;
}

function sendEmail() {
    let email = prompt("Enter recipient email:");
    if (email) {
        let subject = prompt("Enter email subject (e.g., 'Custom Wax Recipe'):") || 'Scoopable Wax Recipe';
        let body = document.getElementById('output').innerText;
        body = body.replace(/<[^>]*>/g, '').replace(/\n/g, '\\n'); // **Fix**: Properly preserve line breaks
        fetch('/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.trim(),
                subject: subject.trim(),
                body: body.trim()
            })
        })
        .then(response => response.text())
        .then(alert)
        .catch(error => alert("Failed to send email: " + error));
    }
}
