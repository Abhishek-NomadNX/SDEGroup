const sheetID = "1ksQzJ8ktwF3c1g7GSImFvpwR0RRxwFkQ8EKP0mfZ95Y";
const query = "";
const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tq=' + query;


fetch(url)
    .then(res => res.text())
    .then(rep => {

        data = JSON.parse(rep.substring(47).slice(0, -2));
        //console.log(data);
        const Projects = [];
        for (let i = 0; i < data.table.rows.length; i++) {
            const Project = getProject(data.table.rows[i]);
            Projects.push(Project);

        }
        const Project = getProject(data.table.rows[0]);
        console.log(Projects);

        Projects.forEach(project => {
            projectContainer.innerHTML = projectContainer.innerHTML + (getProjectCard(project));
        });



    })

function getProjectCard(project) {
    return `<div class="col-lg-4 col-md-6">
                        <div class="single-project mb-30">
                            <div class="project-img">
                                <img src="${project.thumbnailURL}">
                            </div>
                            <div class="project-cap">
                                <a href="project_details.html" class="plus-btn">
                                <i class="ti-plus"></i></a>
                                <h4><a href="project_details.html">${project.name}</a></h4>
                                <h4><a href="project_details.html"><span  style="font-size: 18px; font-weight: 400;">| ${project.ProjectType}</span></a></h4>
                             </div>
                        </div>
                    </div>`;

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
        ProjectClinename: data.c[ProjectIds.ProjectClinename]?.v,
        projectCompletionDate: data.c[ProjectIds.ProjectCompletionDate]?.v,
        additionalProjectDetails: data.c[ProjectIds.additionalProjectDetails]?.v,
        ProjectType: data.c[ProjectIds.ProjectType]?.v,
    };

    return Project;
}


function getimagelink(link) {
    const id = link.substring(link.lastIndexOf('=') + 1);
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    //return `https://drive.google.com/uc?export=download&id=${id}`
}