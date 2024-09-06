
const container = document.querySelector('.container')
const register_form = document.getElementById('register_form')
const login_form = document.getElementById('login_form')
const url_login = 'https://login-teste-c3x7.onrender.com/auth/login'
const url_register ='https://login-teste-c3x7.onrender.com/auth/register'
const url_user = 'https://login-teste-c3x7.onrender.com/user'
//troca de formulários
document.getElementById('back').onclick = () => {
    window.location.href = '../index.html';
}
container.addEventListener('click', (event) =>{
    if(event.target.innerHTML === 'Já tem uma conta?'){
        login_form.style.display = 'flex'
        register_form.style.display = 'none'
    }else if(event.target.innerHTML === 'Ainda não tem uma conta?'){
        login_form.style.display = 'none'
        register_form.style.display = 'flex'
    }
})
/* USER LOGIN FETCH */
async function user_login(email, password) {
    const response = await fetch(url_login,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email: email,
            password: password
        })
    })

    const data = await response.json()
    if(!data.token ){
        alert(data.msg);
    }else{
        localStorage.setItem('userData', JSON.stringify(data))
        start_user()
       
    }
    
}
/*USER REGISTER FETCH*/
async function user_register(inputs) {
    const response = await fetch(url_register,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name: inputs[0].value,
            email: inputs[1].value,
            password: inputs[2].value,
            confirmpassword: inputs[3].value
        })
    })
    const data = await response.json()
    alert(data.msg);
}
/*USER GET */
async function user_get(token, id){
    const response = await fetch(`${url_user}/${id}`,{
        headers: {Authorization: `Bearer ${token}`}
    })
    const data = await response.json()
    return data.user
}
/* Submit login form */
login_form.onsubmit = async (event) => {
    event.preventDefault();
    const email_login = document.getElementById('email_login')
    const password_login = document.getElementById('password_login')
    await user_login(email_login.value, password_login.value)
    login_form.reset()
}
/*Submit register form*/
register_form.onsubmit = async(event) =>{
    event.preventDefault()
    const inputs_register = document.querySelectorAll('#name_register, #email_register, #password_register, #confirmpass_register')
    await user_register(inputs_register)
    register_form.reset();
    login_form.style.display = 'flex'
    register_form.style.display = 'none'
}
console.log(localStorage);

if(localStorage.length > 0 ){
    start_user();
}

/* Start conta */
function start_user() {
    window.location.href = '../user.html';
}
