document.addEventListener("DOMContentLoaded", function () {

    emailjs.init("Imwy-wXiOc_OflV_m"); 

   
    const flatpickrInstance = flatpickr("#fecha", {
        inline: true,
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        locale: "es"
    });


    function mostrarModal(tipo) {
        const modalId = tipo === 'exito' ? 'modalExito' : 'modalError';
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    window.enviarCorreo = function (event) {
        event.preventDefault();

        const nombres = document.getElementById("nombres").value;
        const apellidos = document.getElementById("apellidos").value;
        const identificacion = document.getElementById("identificacion").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;
        const fechaHora = flatpickrInstance.selectedDates[0];

        if (!fechaHora) {
            alert("Selecciona una fecha y hora");
            return;
        }

        const formattedDate = fechaHora.toLocaleString("es-CO", {
            dateStyle: "full",
            timeStyle: "short"
        });

        const templateParams = {
            nombres,
            apellidos,
            identificacion,
            telefono,
            correo,
            fecha: formattedDate
        };

        emailjs.send("service_5aq13rr", "template_iys9lv8", templateParams)
            .then(() => {
                mostrarModal('exito');
                document.getElementById("Datos").reset();

            
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalExito'));
                    if (modal) modal.hide();

                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();
                }, 2000);
            })
            .catch((error) => {
                console.error("Error al enviar el correo:", error);
                mostrarModal('error');
            });
    };
});
