const HOST = "http://localhost:8081";

window.onload = function() {
    document.getElementById("propiedadesInput").value = "";
    document.getElementById("urlsInput").value = "";
};

function toggleInputField() {
    const tipoEntrada = document.getElementById("tipoEntrada").value;
    if (tipoEntrada === "json") {
        document.getElementById("jsonInputContainer").style.display = "block";
        document.getElementById("urlsInputContainer").style.display = "none";
    } else {
        document.getElementById("jsonInputContainer").style.display = "none";
        document.getElementById("urlsInputContainer").style.display = "block";
    }
}

async function execute_script() {
    var error = false;

    const portal = document.getElementById("portalSelector").value;
    const nombreAsesor = document.getElementById("nombreAsesorInput").value;
    const nombreCliente = document.getElementById("nombreClienteInput").value;
    const emailAsesor = document.getElementById("emailAsesorInput").value;
    const telefonoAsesor = document.getElementById("telefonoAsesorInput").value;
    const tipoEntrada = document.getElementById("tipoEntrada").value;

    const propiedadesInput = document.getElementById("propiedadesInput").value;
    const urlsInput = document.getElementById("urlsInput").value;

    const errorNombreAsesor = document.getElementById("errorNombreAsesor");
    const errorNombreCliente = document.getElementById("errorNombreCliente");
    const errorEmailAsesor = document.getElementById("errorEmailAsesor");
    const errorTelefonoAsesor = document.getElementById("errorTelefonoAsesor");
    const errorPropiedades = document.getElementById("errorPropiedades");
    const errorUrls = document.getElementById("errorUrls");

    errorNombreAsesor.innerHTML = "";
    errorEmailAsesor.innerHTML = "";
    errorTelefonoAsesor.innerHTML = "";
    errorPropiedades.innerHTML = "";
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

    if (tipoEntrada === "json" && propiedadesInput.trim() !== "") {
        try {
            JSON.parse(propiedadesInput);
        } catch (SyntaxError) {
            errorPropiedades.innerHTML = "Las propiedades ingresadas no son un JSON válido.";
            error = true;
        }
    }

    if (tipoEntrada === "urls" && urlsInput.trim() === "") {
        errorUrls.innerHTML = "Por favor, ingresa una lista de URLs.";
        error = true;
    }

    if (error) {
        return;
    }

    document.getElementById("status-container").style.display = "block";
    document.getElementById("loading-img").style.display = "block";

    let apiEndpoint = tipoEntrada === "json" ? "/cotizacion" : "/cotizacion_urls";
    let bodyData = {
        portal: portal,
        asesor: {
            name: nombreAsesor,
            email: emailAsesor,
            phone: telefonoAsesor
        },
        cliente: nombreCliente
    };

    if (tipoEntrada === "json") {
        bodyData.posts = JSON.parse(propiedadesInput);
    } else {
        bodyData.urls = urlsInput.split("\n").map(url => url.trim()).filter(url => url !== "");
    }

    fetch(`${HOST}${apiEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        const taskId = data["task_id"];
        checkTaskStatus(taskId);
    })
    .catch(error => {
        console.error(error);
        alert("Ocurrió un error iniciando la cotización");
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
