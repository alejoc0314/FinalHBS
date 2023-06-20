const url = "https://apifinal-5pf3.onrender.com/api/venta";

const anularVenta = async (_id) => {
  Swal.fire({
    title: '¿Está seguro?',
    text: '¿Está seguro de que desea anular la Venta?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      let venta = {
        _id: _id
      };
      fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(venta),
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
            text: 'Error al anular Venta',
            icon: 'error'
          });
          console.error('Error al anular Venta', error);
        });
    };
  });
};

module.exports = {
  anularVenta
}

