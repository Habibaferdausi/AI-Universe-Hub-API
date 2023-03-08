const loadData = (dataLimit) => {
  const url = "https://openapi.programming-hero.com/api/ai/tools";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayTools(data.data.tools, dataLimit));
};

const displayTools = (data, dataLimit) => {
  const toolsContainer = document.getElementById("card-container");
  toolsContainer.textContent = " ";
  //display 6 phone

  const showAll = document.getElementById("show-all");
  if (dataLimit && data.length > 6) {
    showAll.classList.add("d-none");
  } else {
    data = data.slice(0, 6);
    showAll.classList.remove("d-none");
  }

  data.forEach((singleTool) => {
    const toolDiv = document.createElement("div");
    toolDiv.classList.add("col");

    let html = "";
    for (let i = 0; i < singleTool.features.length; i++) {
      html += "<li>" + singleTool.features[i] + "</li>";
    }
    toolDiv.innerHTML = `
    <div class="card mt-5 ">
    <img src=${singleTool.image} class="card-img-top" alt="..." />
    <div class="card-body">
      <h2 class="card-title">Features</h2>
      <p class="card-text text-secondary">
    <ol> ${html ? html : "No Data Found"} </ol>

      </p>
    </div>
    <div class="card-footer"> 
    <h2>${singleTool.name}</h2>

<div class="d-flex justify-content-between">
   <div><p class="text-secondary "><i class="fa-solid fa-calendar-days"></i> <span class=ms-2>${
     singleTool.published_in
   }</span> <p></div>

    <div class= "text-danger">  
        <i class="fas fa-arrow-right" onclick="loadToolDetail('${
          singleTool.id
        }')" data-bs-toggle="modal"
        data-bs-target="#exampleModal"></i>
        </div>
</div>
    </div>
  </div>
          `;
    toolsContainer.appendChild(toolDiv);
  });
  toggleSpinner(false);
};

const dataLimit = () => {
  toggleSpinner(true);

  loadData(7);
};
//spinner

const toggleSpinner = (isLoading) => {
  const loaderSection = document.getElementById("loader");
  if (isLoading) {
    loaderSection.classList.remove("d-none");
  } else {
    loaderSection.classList.add("d-none");
  }
};

//modal id loading section

const loadToolDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  loadToolDetails(data.data);
};

const loadToolDetails = (data) => {
  const modalView = document.getElementById("modal-view");
  console.log(data);
  console.log(data.integrations);
  let features = "";
  for (let i = 1; i <= Object.keys(data.features).length; i++) {
    features += "<li>" + data.features[i].feature_name + "</li>";
  }

  let price1 = "";
  let price2 = "";
  let price3 = "";
  let noPrice1 = "";
  let noPrice2 = "";
  let noPrice3 = "";
  if (data.pricing == null) {
    noPrice1 = "Free of Cost/" + " " + "Basic";
    noPrice2 = "Free of Cost/" + " " + "Pro";
    noPrice3 = "Free of Cost/" + " " + "Enterprise";
  } else {
    price1 = data.pricing[0].price + " " + data.pricing[0].plan;
    price2 = data.pricing[1].price + " " + data.pricing[1].plan;
    price3 = data.pricing[2].price + " " + data.pricing[2].plan;
  }

  let noIntegrations = " ";
  let integrations = "";
  if (data.integrations == null) {
    noIntegrations = "No Data Found";
  } else {
    for (let i = 0; i < data.integrations.length; i++) {
      integrations += "<li>" + data.integrations[i] + "</li>";
    }
  }

  let displayAccuracy = "";
  if (data.accuracy.score == null) {
  } else {
    displayAccuracy = data.accuracy.score * 100 + "% accuracy";
  }

  let input = "";
  let output = "";
  let noInput = "";
  let noOutput = "";
  if (data.input_output_examples == null) {
    noInput = "Can you give any example?";
    noOutput = "No! Not Yet!!! Take a break!!!";
  } else {
    input = data.input_output_examples[0].input;
    output = data.input_output_examples[0].output;
  }

  modalView.innerHTML = `
  <div class="modal-header">
                <button
                  type="button"
                  class="btn-close bg-danger rounded-circle  top- end-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
  <div
                class="modal-body d-flex flex-column flex-lg-row gap-4 mx-auto"
              >
                <div class="card border border-danger" style="width: 22rem">
                  <div class="card-body">
                    <h6 class="fw-bold">
                      ${data.description ? data.description : "No Data Found"}
                    </h6>
                    <div class="container text-center mt-3">
                      <div class="row gap-2">
                        <div class="col  fw-semibold text-center text-success p-2">
                          ${price1 ? price1 : noPrice1}
                          
                        </div>
                        <div class="col fw-semibold text-center text-warning p-2">
                        ${price2 ? price2 : noPrice2}
                        </div>
                        <div class="col fw-semibold text-center text-danger p-2">
                        ${price3 ? price3 : noPrice3}
                        </div>
                      </div>
                    </div>
                    <div class="d-flex mt-4">
                      <div>
                        <h6 class="fw-bold">Features</h6>
                        <ul class= "text-secondary">
                          ${features ? features : "No Data Found"}
                        </ul>
                      </div>
                      <div>
                        <h6 class="fw-bold">Integrations</h6>
                        <ul class= "text-secondary">
                        ${integrations ? integrations : noIntegrations}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card" style="width: 21rem">
                  <div>
                    <img
                      style="width: 100%; height: 14rem"
                      src="${data.image_link[0]}"
                      class="card-img-top"
                      alt="..."
                    />
                    <div
                      class= "accuracy bg-danger position-absolute top-0 end-0  mt-1 text-white rounded ">
                      
                  ${displayAccuracy}


                    </div>
                  </div>

                  <div class="card-body text-center">
                    <h5 class="fw-bold">
                      ${input ? input : noInput}
                        
                    </h5>
                    <p class="text-secondary">
                    ${output ? output : noOutput}
                        
                    </p>
                  </div>
                </div>
              </div>
  `;
};

//short by date section

document.getElementById("short-by").addEventListener("click", function () {
  fetch("https://openapi.programming-hero.com/api/ai/tools")
    .then((res) => res.json())
    .then((data) => shortBy(data.data.tools));

  const shortBy = (data) => {
    const section = document.getElementById("card-container");
    section.innerHTML = "";
    const seeMoreButton = document.getElementById("show-all");
    seeMoreButton.classList.add("d-none");
    data.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));

    data.forEach((singleTool) => {
      let html = "";
      for (let i = 0; i < singleTool.features.length; i++) {
        html += "<li>" + singleTool.features[i] + "</li>";
      }
      section.innerHTML += `
        <div class="col">
              <div class="card mt-5 ">
                <img src="${singleTool.image}" class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">Features</h5>
                  <ol>${html ? html : "No Data Found"}</ol>
                  <hr />
                  <div class="d-flex justify-content-between">
                    <div>
                      <h5 class="card-title">${singleTool.name}</h5>
                      <i class="fa-solid fa-calendar-days"></i><span> ${
                        singleTool.published_in
                      }</span>
                    </div>
                    <div class= "text-danger">  
        <i class="fas fa-arrow-right" onclick="loadToolDetail('${
          singleTool.id
        }')" data-bs-toggle="modal"
        data-bs-target="#exampleModal"></i>
        </div>
                  </div>
                </div>
              </div>
            </div>
        `;
    });
  };
});

loadData();
