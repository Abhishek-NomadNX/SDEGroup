

// Function to get query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch row data
async function fetchService(ServiceSheetID, rowID) {
    // Construct the query

    console.log(ServiceSheetID);

    const query = encodeURIComponent(`SELECT * LIMIT 1 OFFSET ${rowID}`);
    const url = 'https://docs.google.com/spreadsheets/d/' + ServiceSheetID + '/gviz/tq?tq=' + query;
    try {
        const response = await fetch(url);
        const text = await response.text();

        // Parse the response to extract JSON data
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const Service = getService(json.table.rows[0]);

        const mainHeading = document.getElementById('main-heading');
        mainHeading.textContent = Service.name;

        const subHeading = document.getElementById('sub-heading');
        subHeading.textContent = Service.name;

        const serviceDescription = document.getElementById('service-description');
        serviceDescription.textContent = Service.description;

        const ulElement = document.createElement('ul');
        ulElement.className = 'mt-4'

        for (let i = 0; i < Service.subService.length; i++) {
            const liElement = document.createElement('li');

            const h4Element = document.createElement('h5');
            h4Element.style.marginTop = '20px';
            const iconElement = document.createElement('i');
            iconElement.className = 'fa-solid fa-plus mr-2';
            const serviceText = document.createTextNode(Service.subService[i]);

            //h4Element.appendChild(iconElement);
            h4Element.appendChild(serviceText);

            const pElement = document.createElement('p');
            pElement.textContent = Service.subServiceDescription[i] || '';

            liElement.appendChild(h4Element);
            liElement.appendChild(pElement);

            ulElement.appendChild(liElement);
        }

        serviceDescription.appendChild(ulElement);

        //  console.log("Service", Service);


    } catch (error) {
        console.error('Error fetching Project details:', error);
    }
}

function getService(data) {

    console.log(data)

    const service = {
        name: data.c[0]?.v,
        thumbnail: data.c[1]?.v,
        description: data.c[2]?.v,
        subService: [],
        subServiceDescription: [],
    }

    for (let i = 3; i < 21; i += 2) {
        service.subService.push(data.c[i]?.v || "");
        service.subServiceDescription.push(data.c[i + 1]?.v || "");
    }
    console.log(service);

    return service;
}


// Example usage
const ServiceSheetID = '1oq34aPG8Ew1yslhJDorXEFba1TnxOAaZohzZA7lFvsw'; // Replace with your Google Sheet ID
const serviceID = getQueryParam('rowId') || 1; // Default to 2 if no rowId is provided
fetchService(ServiceSheetID, serviceID);