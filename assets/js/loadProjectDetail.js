let slideIndex = 1;

// Function to get query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch row data
async function fetchRowData(sheetID, rowID) {
    // Construct the query

    const query = encodeURIComponent(`SELECT * LIMIT 1 OFFSET ${rowID - 1}`);
    const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tq=' + query;
    try {
        const response = await fetch(url);
        const text = await response.text();

        // Parse the response to extract JSON data
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const Project = getProject(json.table.rows[0]);
        console.log(Project); // Display the data in the console

        const SlideShowContainer = document.getElementById('SlideShowContainer');
        SlideShowContainer.innerHTML = getSlideShow(Project);
        showSlides(slideIndex);

        const ProjectName = document.getElementById('ProjectName');
        ProjectName.textContent = Project.name;

        const ProjectType = document.getElementById('ProjectType');
        ProjectType.textContent = "|   " + Project.projectType;

        const ProjectDescription = document.getElementById('ProjectDescription');
        ProjectDescription.textContent = Project.projectDetails;

        const ProjectClient = document.getElementById('ProjectClient');
        ProjectClient.textContent = "Client - " + Project.projectClientName;


        console.log(Project.projectCompletionDate); // Display the data in the console

        const ProjectCompletionDate = document.getElementById('ProjectCompletionDate');
        ProjectCompletionDate.textContent = "Completion Date - " + formatDateString(Project.projectCompletionDate);

        const AdditionalInformationHeading = document.getElementById('AdditionalInformationHeading');
        AdditionalInformationHeading.textContent = Project.additionalProjectDetails ? "Additional Infromation" : "";

        const AdditionalInformation = document.getElementById('AdditionalInformation');
        AdditionalInformation.textContent = Project.additionalProjectDetails || "";

    } catch (error) {
        console.error('Error fetching Project details:', error);
    }
}

function getSlideShow(Project) {
    var slideShow = "";
    if (Project.thumbnailURL) {
        slideShow += getSlide(Project.thumbnailURL, Project.thumbnaildesc, 1);
    }
    if (Project.thumbnailURL2) {
        slideShow += getSlide(Project.thumbnailURL2, Project.thumbnaildesc2, 2);
    }
    if (Project.thumbnailURL3) {
        slideShow += getSlide(Project.thumbnailURL3, Project.thumbnaildesc3, 3);
    }

    return slideShow;
}

function getSlide(imageLink, imageDescription, index) {

    var slide = `<div class="mySlides fade-x">
                    <div class="numbertext">${index} / 3</div>
                    <img src="${imageLink}" style="width:100%; height:80vh; object-fit: cover; ">`
    if (imageDescription)
        slide += `<div class="gallery-caption">${imageDescription}</div>`
    slide += `</div>
    <a class="prev" style="color: white; background-color: #003f72;"
        onclick="plusSlides(-1)">❮</a>
     <a class="next" style="color: white; background-color: #003f72;"
          onclick="plusSlides(1)">❯</a>`

    return slide;

}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function getProject(data) {
    console.log(data);
    const ProjectIds = {
        name: 1,
        thumbnailURL: 2,
        thumbnaildesc: 3,
        thumbnailURL2: 4,
        thumbnaildesc2: 5,
        thumbnailURL3: 6,
        thumbnaildesc3: 7,
        projectDetails: 8,
        ProjectClinename: 9,
        ProjectCompletionDate: 10,
        additionalProjectDetails: 11,
        ProjectType: 12,

    };
    const Project = {
        name: data.c[ProjectIds.name]?.v,
        thumbnailURL: getimagelink(data.c[ProjectIds.thumbnailURL]?.v),
        thumbnaildesc: data.c[ProjectIds.thumbnaildesc]?.v,
        thumbnailURL2: getimagelink(data.c[ProjectIds.thumbnailURL2]?.v),
        thumbnaildesc2: data.c[ProjectIds.thumbnaildesc2]?.v,
        thumbnailURL3: getimagelink(data.c[ProjectIds.thumbnailURL3]?.v),
        thumbnaildesc3: data.c[ProjectIds.thumbnaildesc3]?.v,
        projectDetails: data.c[ProjectIds.projectDetails]?.v,
        projectClientName: data.c[ProjectIds.ProjectClinename]?.v,
        projectCompletionDate: data.c[ProjectIds.ProjectCompletionDate]?.v,
        additionalProjectDetails: data.c[ProjectIds.additionalProjectDetails]?.v,
        projectType: data.c[ProjectIds.ProjectType]?.v,
    };

    return Project;
}
function getimagelink(link) {
    if (!link) return null;
    const id = link.substring(link.lastIndexOf('=') + 1);
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    //return `https://drive.google.com/uc?export=download&id=${id}`
}

function formatDateString(dateString) {
    // Extract the date components from the string
    const dateParts = dateString.match(/\d+/g);
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    // Create a Date object
    const date = new Date(year, month, day);

    // Array of month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Extract day, month name, and year
    const formattedDay = date.getDate();
    const formattedMonth = months[date.getMonth()];
    const formattedYear = date.getFullYear();

    return `${formattedDay} ${formattedMonth} ${formattedYear}`;
}
// Example usage
const sheetID = '1ksQzJ8ktwF3c1g7GSImFvpwR0RRxwFkQ8EKP0mfZ95Y'; // Replace with your Google Sheet ID
const rowID = getQueryParam('rowId') || 1; // Default to 1 if no rowId is provided
fetchRowData(sheetID, rowID);