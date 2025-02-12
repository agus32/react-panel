import { HOST } from "../../src/ApiHandler";

window.onload = function() {
    document.getElementById("propiedadesInput").value = "";
    document.getElementById("urlsInput").value = "";
};

async function execute_script() {
    let error = false;

    const nombreAsesor = document.getElementById("nombreAsesorInput").value;
    const nombreCliente = document.getElementById("nombreClienteInput").value;
    const emailAsesor = document.getElementById("emailAsesorInput").value;
    const telefonoAsesor = document.getElementById("telefonoAsesorInput").value;

    const urlsInput = document.getElementById("urlsInput").value;

    const errorNombreAsesor = document.getElementById("errorNombreAsesor");
    const errorNombreCliente = document.getElementById("errorNombreCliente");
    const errorEmailAsesor = document.getElementById("errorEmailAsesor");
    const errorTelefonoAsesor = document.getElementById("errorTelefonoAsesor");
    const errorUrls = document.getElementById("errorUrls");

    errorNombreAsesor.innerHTML = "";
    errorEmailAsesor.innerHTML = "";
    errorTelefonoAsesor.innerHTML = "";
    errorUrls.innerHTML = "";

    if (nombreAsesor.trim() === "") {
        errorNombreAsesor.innerHTML = "Por favor, ingresa el nombre del asesor.";
        error = true;
    }

    if (nombreCliente.trim() === "") {
        errorNombreCliente.innerHTML = "Por favor, ingresa el nombre del asesor.";
        error = true;
    }

    if (emailAsesor.trim() === "") {
        errorEmailAsesor.innerHTML = "Por favor, ingresa el email del asesor.";
        error = true;
    }

    if (telefonoAsesor.trim() === "") {
        errorTelefonoAsesor.innerHTML = "Por favor, ingresa el teléfono del asesor.";
        error = true;
    }

    if (error) {
        return;
    }

    document.getElementById("status-container").style.display = "block";
    document.getElementById("loading-img").style.display = "block";

    const apiEndpoint = "/cotizacion";
    const bodyData = {
        asesor: {
            name: nombreAsesor,
            email: emailAsesor,
            phone: telefonoAsesor
        },
        cliente: nombreCliente,
        urls: urlsInput.split("\n").map(url => url.trim()).filter(url => url !== "")
    };

    fetch(`${HOST}${apiEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if ("error" in data){
            alert(data["error"]);
            document.getElementById("loading-img").style.display = "none";
        }else{
            const taskId = data["task_id"];
            checkTaskStatus(taskId);
        }
    })
    .catch(error => {
        console.error(error);
        alert(error);
        document.getElementById("loading-img").style.display = "none";
    });
}

function checkTaskStatus(taskId) {
    const interval = setInterval(() => {
        fetch(`${HOST}/check-task/${taskId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'completed') {
                    clearInterval(interval);
                    document.getElementById("loading-img").style.display = "none";
                    window.open(`${HOST}/download/${data.pdf_file_name}`, '_blank');
                } else if (data.status === 'error') {
                    clearInterval(interval);
                    document.getElementById("loading-img").style.display = "none";
                    alert('Ocurrió un error generando la cotización.: '+data.error);
                }
            })
            .catch(error => {
                clearInterval(interval);
                document.getElementById("loading-img").style.display = "none";
                console.error(error);
                alert("Ocurrió un error verificando el estado de la cotización");
            });
    }, 2000);
}
