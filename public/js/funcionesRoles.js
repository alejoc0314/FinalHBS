const url = "https://apifinal-5pf3.onrender.com/api/rol";

let selectedModules = [];

document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const moduleName = event.target.value;
      if (event.target.checked) {
        if (moduleName !== '' && !selectedModules.includes(moduleName)) {
          selectedModules.push(moduleName);
        }
      } else {
        const index = selectedModules.indexOf(moduleName);
        if (index > -1) {
          selectedModules.splice(index, 1);
        }
      }
      console.log(selectedModules);
    });

    const moduleName = checkbox.value;
    if (checkbox.checked && moduleName !== '1' && !selectedModules.includes(moduleName)) {
      selectedModules.push(moduleName);
    }
  });
});

const validateForm = (nombre, descripcion) => {

  const validateNombre = () => {
    let texto;
    let expresion = /[a-zA-Z]/;
    if (nombre === null || nombre === '' || nombre.length === 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese su nombre</span>';
      document.getElementById('texto1').innerHTML = texto;
      return false;
    } else if (nombre.length < 4) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Tiene que ser mayor o igual a 4 caracteres</span>';
      document.getElementById('texto1').innerHTML = texto;
      return false;
    } else if (!expresion.test(nombre)) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese solo caracteres válidos(Letras)</span>';
      document.getElementById('texto1').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto1').innerHTML = '';
      return true;
    }

  };

  const validateDescripcion = () => {
    let texto;
    let expresion = /[a-zA-Z]/;
    if (descripcion === null || descripcion === '' || descripcion.length === 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese una descripción</span>';
      document.getElementById('texto2').innerHTML = texto;
      return false;
    } else if (descripcion.length < 10) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Tiene que ser mayor o igual a 10 caracteres</span>';
      document.getElementById('texto2').innerHTML = texto;
      return false;
    } else if (!expresion.test(descripcion)) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese solo caracteres válidos(Letras)</span>';
      document.getElementById('texto2').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto2').innerHTML = '';
      return true;
    }
  };

  const validateModules = () => {
    let texto;
    if (selectedModules.length == 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Seleccione como mínimo un módulo</span>';
      document.getElementById('texto3').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto3').innerHTML = '';
      return true;
    }
  }

  validateNombre();
  validateDescripcion();
  validateModules();
}

const registrarRol = async () => {
  // Obtener los datos
  const nombre = document.getElementById('nombreRol').value;
  const descripcion = document.getElementById('descripcionRol').value;

  // Realizar las validaciones
  validateForm(nombre, descripcion);

  // Realizar la inserción de los datos
  let rol = {
    nombreRol: nombre,
    descripcionRol: descripcion,
    modulosRol: selectedModules,
  };
  console.log(rol);

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(rol),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Rol agregado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          //listarDatos();
          window.location.href = '/roles';
        }
      });
    } else {
      console.error('Error al crear Rol', response.status);
      Swal.fire({
        title: 'Error',
        text: 'Error al crear el Rol',
        icon: 'error',
      });
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    Swal.fire({
      title: 'Error',
      text: 'Error al realizar la solicitud',
      icon: 'error',
    });
  }
};

const editarRol = async (_id) => {
  const nombreRol = document.getElementById('nombreRol').value;
  const descripcionRol = document.getElementById('descripcionRol').value;

  const rol = {
    _id: _id,
    nombreRol: nombreRol,
    descripcionRol: descripcionRol,
    modulosRol: selectedModules
  };

  Swal.fire({
    title: '¿Está seguro?',
    text: '¿Está seguro de que desea editar el Rol?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url + `/${_id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(rol),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Error en la solicitud de actualización');
          }
          return resp.json();
        })
        .then(json => {
          Swal.fire({
            title: 'Actualizado',
            text: json.msg,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              // Realizar alguna acción después de la confirmación
              window.location.href = "roles";
            }
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Error al editar el Rol',
            icon: 'error'
          });
          console.error('Error al editar el Rol', error);
        });
    }
  });
};


const eliminarRol = async (_id) => {
  Swal.fire({
    title: '¿Está seguro?',
    text: '¿Está seguro de que desea eliminar el Rol?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      let rol = {
        _id: _id
      };
      fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(rol),
      })
        .then((resp) => resp.json())
        .then(json => {
          Swal.fire({
            title: 'Eliminado',
            text: json.msg,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            };
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Error al eliminar Rol',
            icon: 'error'
          });
          console.error('Error al eliminar Rol', error);
        });
    };
  });
};

module.exports = {
  registrarRol,
  eliminarRol,
  editarRol
};