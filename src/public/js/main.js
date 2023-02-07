const enviarForm = document.getElementById('enviar-form')

const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const telefono = document.getElementById('telefono')
const consulta = document.getElementById('consulta')

const errorNombre = document.getElementById('error-nombre')
const errorEmail = document.getElementById('error-email')
const errorTelefono = document.getElementById('error-telefono')
const errorConsulta = document.getElementById('error-consulta')

let botonesSeguro = document.getElementsByClassName('boton-seguro')
let img_btn_seguro_cerrado = document.getElementsByClassName('img-botones-seguro')
let img_btn_seguro_abierto = document.getElementsByClassName('img-botones-seguro-abierto')


function changeStateBtn(index) {

    for (let i = 0; i < botonesSeguro.length; i++) {
        img_btn_seguro_abierto[i].style.display = "none";
        img_btn_seguro_cerrado[i].style.display = 'block';
    }

    let boton = botonesSeguro[index]
    if (boton.ariaExpanded == 'true') {
        img_btn_seguro_abierto[index].style.display = 'block';
        img_btn_seguro_cerrado[index].style.display = 'none';
    } else {
        img_btn_seguro_abierto[index].style.display = 'none';
        img_btn_seguro_cerrado[index].style.display = 'block';
    }

}

function desplegarDesdeNav(id, collapse) {
    var x = document.getElementById(id).getAttribute("aria-expanded");
    if (x == "false") {
        x = "true"
        document.getElementById(id).classList.add('collapsed');
        document.getElementById(collapse).classList.remove('show');
    } else {
        document.getElementById(id).classList.remove('collapsed');
        document.getElementById(collapse).classList.add('show');
        x = "false"
    }
    document.getElementById(id).setAttribute("aria-expanded", x);
}


const uploadImages = document.getElementById('uploadImages');
//Envio de los datos al servidor ----------------------------
uploadImages.onclick = async function () {
    // alert('datos enviados correctamente')
    const image = document.getElementById('foto_cedula_frente')
    let description = 'cedula_frente'
    let extension = image.files[0].name.split('.').pop();
    let r = (Math.random() + 1).toString(36).substring(2);
    let filename = description + '_' + r + '.' + extension

    const formData = new FormData()
    formData.append('myFile', image.files[0], filename);
    console.log(formData);

    if (image == '') {
        alert('No pueden quedar campos vacíos!');
    } else {
        console.log(filename);
        imageUpload(formData);
        sendEmailData(description, filename);
        postData(description, filename);

        window.location.href = 'index.html';
        // sendEmailData()
    }

}

async function imageUpload(formData) {
    await fetch('/api/saveImage', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    });

}


async function postData(description, image) {

    const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'description': description,
            "image": image
        })

    });

    const data = await response.json();
    console.log(data);

}

async function sendEmailData(description, image) {

    // const response = await fetch('/api/files');
    // const data = await response.json();
    // console.log(data);
    // let last = data.files.length -1
    // console.log(last);
    // console.log(data.files[last]);
    // let ultimaImg = data.files[last]

    await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'description': description,
            "image": image
        })
    });
    // await fetch('/api/upload', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json'
    //     },
    //     body: ultimaImg
    // });
    //Mostramos los datos recibidos y los imprimimos en el documento:

    // for (item of data.files) {

    //     const root = document.createElement('div');
    //     const card = document.createElement('div');
    //     const cardBody = document.createElement('div');
    //     const descripcion = document.createElement('h5');
    //     const fecha = document.createElement('small');
    //     const imagen = document.createElement('img');

    //     card.className = 'card mb-3';
    //     cardBody.className = 'card-body';
    //     imagen.className = 'img-fluid';
    //     descripcion.className = 'mt-2';

    //     descripcion.textContent = item.description;
    //     const dateString = new Date(item.date).toLocaleString();
    //     fecha.textContent = dateString;
    //     imagen.src = './images/' + item.image;

    //     cardBody.append(imagen, descripcion, fecha);
    //     card.append(cardBody);
    //     root.append(card);
    //     document.getElementById('portfolio').append(root);

    // }
}

function validarConsulta() {

    if (nombre.value === null || nombre.value === '') {
        errorNombre.innerHTML = `ingresa tu nombre`
    } else {
        errorNombre.innerHTML = ""
    }

    if (email.value === null || email.value === '') {
        errorEmail.innerHTML = `ingresa tu email`
    } else {
        errorEmail.innerHTML = ""
    }

    if (telefono.value === null || telefono.value === '') {
        errorTelefono.innerHTML = `ingresa tu telefono`
    } else {
        errorTelefono.innerHTML = ""
    }

    if (consulta.value === null || consulta.value === '') {
        errorConsulta.innerHTML = `ingresa tu consulta`
    } else {
        errorConsulta.innerHTML = ""
    }
    if (nombre.value == '' || email.value == '' || telefono.value == '' || consulta.value == '') {
        alert('por favor, complete todos los campos')
        return (false)
    } else {
        alert('consulta enviada')
        axios({
            method: 'post',
            url: '/send-email',
            data: {
                nombre: nombre.value,
                email: email.value,
                telefono: telefono.value,
                consulta: consulta.value
            }
        });
    }

}
