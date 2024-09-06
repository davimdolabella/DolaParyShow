
const userData = JSON.parse(localStorage.getItem('userData'))

const url_user = 'https://login-teste-c3x7.onrender.com/user'
console.log(localStorage);
/*USER GET */
async function user_get(token, id){
    const response = await fetch(`${url_user}/${id}`,{
        headers: {Authorization: `Bearer ${token}`}
    })
    const data = await response.json()
    return data.user
}

start(userData)

/*start*/
async function start(data) {
    user = await user_get(data.token, data.id)
    // await user;
    document.getElementById('init').innerHTML = `
        <h1 class="mb-5">Olá ${user.name}!</h1>
        <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3 px-2">
            <div class="container-fluid justify-content-between p-2">
            <div class="navbar-brand">DolaPartyShow</div>
            <button id="logout" class="btn btn-outline-danger">Sair</button>
            </div>
        </nav>
        <div class="row justify-content-center">
            <div class="btn btn-outline-primary rouded col-4 mt-3 me-2" id="create_party_button">
                Criar Festa
            </div>
            <div class="btn btn-outline-primary rouded col-4 mt-3 ms-2" id="my_party_button">
                Minhas Festas
            </div>
        </div>
        
       
    `

    document.getElementById('logout').onclick = () => {
        localStorage.removeItem('userData');
        window.location.href = '../index.html'; // Redireciona para a página de login
    }
    /******************************************************************************* */
    const url_api_parties = 'https://dolaparyshow.onrender.com/api/parties'
    const url_api_services = 'https://dolaparyshow.onrender.com/api/services'
    const parties_container = document.getElementById('parties_container');
    const party_form = document.getElementById('party_form');
    const create_party_button = document.getElementById('create_party_button');
    let parties = [];
    let my_parties = false;
    let servicesdata = [];
    let my_party_button = document.getElementById('my_party_button')
    my_party_button.onclick = () =>{
        if(!my_parties){
            my_party_button.innerHTML = 'Festas Públicas'
        }else{
            my_party_button.innerHTML = 'Minhas Festas'
        }
        my_parties = !my_parties
        parties_container.innerHTML = '<h2>Carregando...<h2>';
        start_parties();
        console.log(my_parties); 
    }
    create_party_button.onclick = () =>{
        if(parties_container.style.display != 'none'){
            create_party_button.innerHTML = 'Voltar'
            parties_container.style.display = 'none';
            party_form.style.display = 'flex';
        }else{
            create_party_button.innerHTML = 'Criar Festa'
            parties_container.style.display = 'flex';
            party_form.style.display = 'none';
        }
    }
    async function Get_parties() {
        const response = await fetch(url_api_parties);
        const data = await response.json();
        return data
    }
    
    async function get_services() {
        const services_form = document.getElementById('services_form');
        const response = await fetch(url_api_services);
        const data = await response.json();
        servicesdata = data;
        console.log(servicesdata);
        
        data.forEach(service =>{
            services_form.innerHTML += `
                <div class="col-md-4 col-sm-12">
                    <div class="card mb-5 shadow-sm p-2">
                        <div class="img_party" style=" background-image: url('${service.image}'); background-size: cover;"></div>
                        <div class="card-body">
                            <div class="card-title">
                                <h2>${service.name}</h2>
                            </div>
                            <div class="card-text">
                                <hr>
                                <p>
                                    Preço: R$${service.price}
                                </p>
                            </div>
                            <input type="checkbox" value="${service._id}" class="form-check-input me-2"> <span>Adicionar</span>
                        </div>      
                    </div>
                </div>
            `
        })
        
    }
    party_form.onsubmit = async (e) => {
        e.preventDefault();
        create_party_button.innerHTML = 'Criar Festa'
        let public = document.getElementById('select_party_form').value
        
        let party_object = {
            "title": document.getElementById('title_party_form').value,
            "author": user.name,
            "description": document.getElementById('description_party_form').value,
            "budget": parseFloat(document.getElementById('budget_party_form').value),
            "image":document.getElementById('image_party_form').value,
            "services": [],
            "email": user.email,
            "public": public
        }
        let service_price = 0;
         const service_checkboxes = document.querySelectorAll('#services_form input[type="checkbox"]');
         service_checkboxes.forEach(checkbox => {
             if (checkbox.checked) {
                 const serviceId = checkbox.value;
                 const selectedService = servicesdata.find(service => service._id === serviceId);
     
                 if (selectedService) {
                     party_object.services.push(selectedService);
                     service_price += selectedService.price
                 }
             }
         });
         if(service_price <= party_object.budget){
            const response = await fetch(url_api_parties,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(party_object)
            })
            const data = await response.json();
            console.log(data);
            start_parties();
            party_form.reset();
            parties_container.style.display = 'flex';
            party_form.style.display = 'none';
         }else{
            alert('orçamento muito baixo!')
         }
        
        
    }
    
    get_services();
    async function start_parties() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        const parties = await Get_parties();  // Espera a função Get_parties terminar
        if (parties.length > 0) {
            parties_container.innerHTML = ''; 
            parties.forEach(party => {
                console.log(party, user)
                let party_servicos = '';
                if(party.services.length == 0){party_servicos = ' Nenhum'}
                for (let i = 0; i < party.services.length; i++) {
                    party_servicos += ` "${party.services[i].name}"`; 
                }
                let c = 0;
                if(party.public){
                    if(my_parties == true){
                        if(user.email === party.email){
                            c ++;
                            parties_container.innerHTML += `
                                <div class="col-lg-4 col-md-6 col-sm-12  text-md-start text-center">
                                    <div class="card mb-5 shadow-sm p-2">
                                        <div class="img_party" style=" background-image: url('${party.image}');"></div>
                                        <div class="card-body">
                                            <div class="card-title">
                                                <h2>${party.title}</h2>
                                            </div>
                                            <div class="card-text">
                                                <hr>
                                                <p>
                                                    Orçamento: R$${party.budget}
                                                </p>
                                            </div>
                                            <div class="btn btn-outline-primary rounded " id="${party._id}">Detalhes</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        if(c === 0){
                            parties_container.innerHTML = '<h3 class="text-center">Você não possui Festas no momento</h3>';
                        }
                    }else{
                        parties_container.innerHTML += `
                            <div class="col-lg-4 col-md-6 col-sm-12  text-md-start text-center">
                                <div class="card mb-5 shadow-sm p-2">
                                    <div class="img_party" style=" background-image: url('${party.image}');"></div>
                                    <div class="card-body">
                                        <div class="card-title">
                                            <h2>${party.title}</h2>
                                        </div>
                                        <div class="card-text">
                                            <hr>
                                            <p>
                                                Orçamento: R$${party.budget}
                                            </p>
                                        </div>
                                        <div class="btn btn-outline-primary rounded " id="${party._id}">Detalhes</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    if (c > 0 && my_parties === true) {
                        parties_container.firstChild.innerHTML = '';
                    }
                }else{
                    if(my_parties == true){
                        if(user.email === party.email){
                            c ++;
                            parties_container.innerHTML += `
                                <div class="col-lg-4 col-md-6 col-sm-12  text-md-start text-center">
                                    <div class="card mb-5 shadow-sm p-2">
                                        <div class="img_party" style=" background-image: url('${party.image}');"></div>
                                        <div class="card-body">
                                            <div class="card-title">
                                                <h2>${party.title}</h2>
                                            </div>
                                            <div class="card-text">
                                                <hr>
                                                <p>
                                                    Orçamento: R$${party.budget}
                                                </p>
                                            </div>
                                            <div class="btn btn-outline-primary rounded " id="${party._id}">Detalhes</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        if(c === 0){
                            parties_container.innerHTML = '<h3 class="text-center">Você não possui Festas no momento</h3>';
                        }else if( c > 0 && parties_container.innerHTML === '<h3 class="text-center">Você não possui Festas no momento</h3>'){
                            parties_container.innerHTML = '';
                        }
                    }
                    if (c > 0 && my_parties === true) {
                        parties_container.firstChild.innerHTML = '';
                    }
                }
                
                
               
            });
            parties_container.addEventListener('click', (e) => {
                if (e.target && e.target.innerHTML === 'Detalhes') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                    const party_details = document.getElementById('party_details')
                    const selectedParty = parties.find(party => e.target.id === party._id);
                    let preco = 0;
                    for(let i = 0; i < selectedParty.services.length; i++){
                        preco += selectedParty.services[i].price
                    }
                    party_details.style.display = 'block'
                    parties_container.style.display = 'none'
                    party_details.innerHTML = `
                        <div class="col-lg-4 col-md-6 col-sm-12 mx-auto">
                        <div class="card mb-5 shadow-sm p-2">
                            <div class="card-body">
                                <div class="card-title text-center">
                                    <h2>${selectedParty.title}</h2>
                                </div>
                                <div class="card-text text-center mb-3">
                                    <hr>
                                    <p>
                                        Autor: ${selectedParty.author}
                                    </p>
                                    <hr>
                                    <p>
                                        Orçamento: R$${selectedParty.budget}
                                    </p>
                                    <hr>
                                    <p>
                                        Preço: R$${preco}
                                    </p>
                                    <hr>
                                    <p class=" px-3">
                                       Descrição: ${selectedParty.description}
                                    </p>
                                    <hr>
                                </div>
                                <div class="d-flex justify-content-center">
                                    <div class="btn btn-outline-primary rounded me-2" >Voltar</div>
                                    <div class="btn btn-outline-danger rounded" id="delet_button" style="display:none;">Deletar</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <h2 class="text-center my-5">Serviços:</h2>
                     <div class="row col-12 g-3 justify-content-center" id="party_details_service"></div>
                   
                    `
                    if(selectedParty.email === user.email){
                        document.getElementById('delet_button').style.display = 'block'
                    }
                    if(selectedParty.services.length > 0){
                        selectedParty.services.forEach(service =>{
                            document.getElementById('party_details_service').innerHTML += `
                                <div class="col-lg-3 col-sm-5 mx-1">
                                    <div class="card mb-5 shadow-sm p-2">
                                        <div class="img_party" style=" background-image: url('${service.image}'); background-size: cover;"></div>
                                        <div class="card-body">
                                            <div class="card-title">
                                                <h4>${service.name}</h4>
                                            </div>
                                            <div class="card-text">
                                                <hr>
                                                <p>
                                                    Preço: R$${service.price}
                                                </p>
                                            </div>
                                        </div>      
                                    </div>
                                </div>
                            `
                        })
                    }else{
                        document.getElementById('party_details_service').innerHTML = '<h2 class="text-center">Sem serviços...</h2>'
                    }
                    party_details.onclick = (e) =>{
                        switch (e.target.innerHTML){
                            case "Deletar":
                                Delete_party(selectedParty._id)
                                break;
                            case "Voltar":
                                party_details.style.display = 'none'
                                parties_container.style.display = 'flex'
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                })
                                break;
                        }
                    }
                }
                
            });
        } else {
            parties_container.innerHTML = '<h2 class="text-center">Nenhuma festa...</h2>';
        }
    
    }
    async function Delete_party(id){
        const response = await fetch(url_api_parties+'/'+id, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: user.email
            })
        })
        start_parties();
        party_details.style.display = 'none'
        parties_container.style.display = 'flex'
        const data = await response.json();
    }
    start_parties();
    
    
    
}
console.log(userData);

