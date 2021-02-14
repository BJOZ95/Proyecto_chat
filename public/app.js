const botones = document.querySelector('#botones')
const nombreusuario= document.querySelector('#NombreUsuario')
const Contenido_Protegido =document.querySelector('#Contenido_Protegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged( (user) => {
    if(user){
        console.log(user)
        botones.innerHTML=/*html*/ `
            <button class="btn btn-outline-danger" id='CerrarSecion'>Cerrar Sesión</button>
        `  
        nombreusuario.innerHTML= user.displayName   
        cerraSecion()
  
        formulario.classList= "input-group py-3 fixed-bottom container"
        contenidoChat(user)
    }else{
        console.log('no existe user')
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-success mr-2" id='Acceder'>Acceder</button>
        `
        Contenido_Protegido.innerHTML=/*html*/`
            <p class="text-center lead mt-5 text-white fw-bold fs-4">Debes Loggearte primero, ok? </p>
        `
        iniciarSecion()
        nombreusuario.innerHTML= 'Chat'
        formulario.classList= "input-group py-3 fixed-bottom container d-none"
    }

});
const iniciarSecion = () =>{
    const Acceder = document.querySelector('#Acceder')
    Acceder.addEventListener('click', async()=>{
        // console.log(`diste click`)
        try{
            const provider=new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider)

        }catch (error){
            console.log(Error)
        }
    })
}
const contenidoChat=(user)=> {

    formulario.addEventListener('submit', (e)=> {
        e.preventDefault()
        console.log(inputChat.value)

        if(!inputChat.value.trim()){
            console.log('input en blanco')
            return
        }
        firebase.firestore().collection('Chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
            .then(res => {console.log('mensaje guardado')})
            .catch(e => console.log(e))

        inputChat.value= ''
    })

    firebase.firestore().collection("Chat").orderBy('fecha')
        .onSnapshot(query => {
            //console.log(query)
            Contenido_Protegido.innerHTML= ''
            query.forEach(doc => {
                console.log(doc.data())
                if(doc.data().uid===user.uid){
                    Contenido_Protegido.innerHTML += /*html*/ `
                        <div class="d-flex justify-content-end">
                            <span class="badge rounded-pill bg-dark ">${doc.data().texto}</span>
                        </div>
                    `
                }else{
                    Contenido_Protegido.innerHTML += /*html*/`
                        <div class="d-flex justify-content-start">
                            <span class="badge rounded-pill bg-white text-dark">${doc.data().texto}</span>
                        </div>
                    `
                }
                Contenido_Protegido.scrollTop=Contenido_Protegido.scrollHeight
                
            })
        })
}

const cerraSecion = () =>{
    const CerrarSecion = document.querySelector('#CerrarSecion')
    CerrarSecion.addEventListener('click', ()=>{
        firebase.auth().signOut()
    })
}
