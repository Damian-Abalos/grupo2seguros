const enviarForm = document.getElementById('enviar-form')

const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const telefono = document.getElementById('telefono')
const consulta = document.getElementById('consulta')


const errorNombre = document.getElementById('error-nombre')
const errorEmail = document.getElementById('error-email')
const errorTelefono = document.getElementById('error-telefono')
const errorConsulta = document.getElementById('error-consulta')

let botonesSeguro = document.getElementsByClassName('accordion-button')
let img_btn_seguro_cerrado = document.getElementsByClassName('img-botones-seguro')
let img_btn_seguro_abierto = document.getElementsByClassName('img-botones-seguro-abierto')

function changeStateBtn(indexElement) {
    for (let index = 0; index < botonesSeguro.length; index++) {
        img_btn_seguro_abierto[index].style.display = 'none';
        img_btn_seguro_cerrado[index].style.display = 'block';
        
    }
    let boton = botonesSeguro[indexElement]
    if (boton.ariaExpanded == 'true') {
        console.log('boton abierto');
        img_btn_seguro_abierto[indexElement].style.display = 'block';
        img_btn_seguro_cerrado[indexElement].style.display = 'none';
    } else {
        img_btn_seguro_abierto[indexElement].style.display = 'none';
        img_btn_seguro_cerrado[indexElement].style.display = 'block';
    }

}
let cedulafrente = document.getElementById('input-cedula-frente')
let toinsert = document.getElementById('insertfile')
function mostrarimg() {
    alert(cedulafrente); 
}

function validarConsulta(){

    // e.preventDefault();
    


    if (nombre.value === null || consulta.value === '') {
        errorNombre.innerHTML = `ingresa tu nombre`
    }

    if (email.value === null || email.value === '') {
        errorEmail.innerHTML = `ingresa tu email`
    }

    if (telefono.value === null || telefono.value === '') {
        errorTelefono.innerHTML = `ingresa tu telefono`
    }

    if (consulta.value === null || consulta.value === '') {
        errorConsulta.innerHTML = `ingresa tu consulta`
    }    
    if (nombre.value == '' || email.value == '' || telefono.value == '' || consulta.value == '') {
        alert('por favor, complete todos los campose')        
    } else {
        alert('consulta enviada')
    }
    
}