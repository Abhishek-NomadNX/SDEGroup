

// Function to get query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch row data
async function fetchProjects(projectsSheetID, rowID) {
    // Construct the query

    //console.log(ServiceSheetID);

    var serviceName = getServiceName(rowID);



    console.log("Service ID" + rowID);
    console.log("Service Name" + serviceName);

    const query = encodeURIComponent(`SELECT * WHERE M = '${serviceName}'`);
    const url = 'https://docs.google.com/spreadsheets/d/' + projectsSheetID + '/gviz/tq?tq=' + query;
    try {
        const response = await fetch(url);
        const text = await response.text();
        data = JSON.parse(text.substring(47).slice(0, -2));

        //console.log(data);
        const Projects = [];
        for (let i = 0; i < data.table.rows.length; i++) {
            const Project = getProject(data.table.rows[i]);
            Projects.push(Project);

        }
        const Project = getProject(data.table.rows[0]);
        console.log(Projects);

        const projectContainer = document.getElementById('servicesContainer');

        for (let i = 0; i < Projects.length; i++) {
            projectContainer.innerHTML = projectContainer.innerHTML + (getProjectCard(Projects[i], i + 1));
        }



        //  console.log("Service", Service);


    } catch (error) {
        console.error('Error fetching Project details:', error);
    }
}

function getServiceName(rowID) {

    console.log(rowID)

    if (rowID == 1) return 'Architecture Design';
    if (rowID == 2) return 'Structure Design';
    if (rowID == 3) return 'Building Construction';
    if (rowID == 4) return 'Survey';
    if (rowID == 5) return 'Soil GeoTech Investigation';
    if (rowID == 6) return 'PMC - TPI';
    if (rowID == 7) return 'Commerce & Contract Managment';
    if (rowID == 8) return 'Building Repair & Maintenance Work';
    if (rowID == 9) return 'Electrical Work';

}

const projectsSheetID = "1ksQzJ8ktwF3c1g7GSImFvpwR0RRxwFkQ8EKP0mfZ95Y";
fetchProjects(projectsSheetID, serviceID);



function getProjectCard(project, index) {
    return `<div class="col-lg-4 col-md-6">
                        <div class="single-project mb-30">
                            <div class="project-img">
                                <img src="${project.thumbnailURL}" style="height:40vh; object-fit:cover">
                            </div>
                            <div class="project-cap">
                                <a href="projectDetails.html?rowId=${index}" class="plus-btn">
                                <i class="ti-plus"></i></a>
                                <h4><a href="projectDetails.html?rowId=${index}">${project.name}</a></h4>
                                <h4><a href="projectDetails.html?rowId=${index}"><span  style="font-size: 18px; font-weight: 400;">| ${project.ProjectType}</span></a></h4>
                             </div>
                        </div>
                    </div>`;

}
function getProject(data) {
    //console.log(data);
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
        projectDetails: data.c[ProjectIds.projectDetails]?.v,
        ProjectClinename: data.c[ProjectIds.ProjectClinename]?.v,
        projectCompletionDate: data.c[ProjectIds.ProjectCompletionDate]?.v,
        additionalProjectDetails: data.c[ProjectIds.additionalProjectDetails]?.v,
        ProjectType: data.c[ProjectIds.ProjectType]?.v,
    };

    return Project;
}


function getimagelink(link) {
    if (!link) return null;
    const id = link.substring(link.lastIndexOf('=') + 1);
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    //return `https://drive.google.com/uc?export=download&id=${id}`
}