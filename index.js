const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const axios = require('axios');
const port = 8081;


hbs.registerHelper('if', function (conditional, options) {
    if (conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('jsonStringify', function (context) {
    return JSON.stringify(context);
});

hbs.registerHelper('toLocaleDate', function (context) {
    const fecha = new Date(context);
    return fecha.toLocaleDateString();
});

app.use(express.static('public'));

app.use(express.json());

app.set('views', path.join(__dirname + '/public/views'));

app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/public/views/partials');

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log('listening on port ' + port);
});

// Página de login

app.get('/', (req, res) => {

    res.render('login', {
        titulo: 'CosmeTIC',
        user_name: 'Julian Carreño',
        consecutivo: 'Login'
    });
})

// Página de inicio

app.get('/home', (req, res) => {

    res.render('home', {
        titulo: 'CosmeTIC',
        user_name: 'Julian Carreño',
        consecutivo: 'Home'
    });
})

// Página de Roles

app.get('/roles', async (req, res) => {
    try {
        const url = "https://apifinal-5pf3.onrender.com/api/rol";
        const response = await axios.get(url, {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (response.status === 200) {
            const data = response.data;
            const roles = data.rol;
            res.render('Roles/roles', {
                titulo: 'CosmeTIC | Roles',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Roles',
                lista_roles: roles
            });
        } else {
            console.error("Error al obtener la lista de roles:", response.status);
            res.status(response.status).send("Error al obtener la lista de roles");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        res.status(500).send("Error al obtener los roles");
    }
});

app.get('/registroRoles', (req, res) => {

    const modulos = [
        {
            nombre_modulo: 'Dashboard'
        }, {
            nombre_modulo: 'Usuarios'
        }, {
            nombre_modulo: 'Proveedores'
        }, {
            nombre_modulo: 'Compras'
        }, {
            nombre_modulo: 'Categorias de Productos'
        }, {
            nombre_modulo: 'Productos'
        }, {
            nombre_modulo: 'Clientes'
        }, {
            nombre_modulo: 'Empleados'
        }, {
            nombre_modulo: 'Pedidos'
        }, {
            nombre_modulo: 'Ventas'
        }, {
            nombre_modulo: 'Pagos'
        }, {
            nombre_modulo: 'Devoluciones'
        }, {
            nombre_modulo: 'Comisiones'
        }];
    res.render('Roles/registroRoles', {
        titulo: 'CosmeTIC | Nuevo Rol',
        user_name: 'Alejandro Cañas',
        consecutivo: 'Roles',
        lista_modulos: modulos
    });
})

app.get('/editarRoles', async (req, res) => {
    const modulos = [
        {
            nombre_modulo: 'Dashboard'
        }, {
            nombre_modulo: 'Usuarios'
        }, {
            nombre_modulo: 'Proveedores'
        }, {
            nombre_modulo: 'Compras'
        }, {
            nombre_modulo: 'Categorias de Productos'
        }, {
            nombre_modulo: 'Productos'
        }, {
            nombre_modulo: 'Clientes'
        }, {
            nombre_modulo: 'Empleados'
        }, {
            nombre_modulo: 'Pedidos'
        }, {
            nombre_modulo: 'Ventas'
        }, {
            nombre_modulo: 'Pagos'
        }, {
            nombre_modulo: 'Devoluciones'
        }, {
            nombre_modulo: 'Comisiones'
        }];
    try {
        const rolId = req.query._id;
        const url = `https://apifinal-5pf3.onrender.com/api/rol/getOne?_id=${rolId}`;
        const response = await axios.get(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (response.status === 200) {
            const rol = response.data;
            console.log(rol);
            const modulosRol = rol.rol.modulosRol;
            const modulosConEstado = modulos.map((modulo) => ({
                nombre_modulo: modulo.nombre_modulo,
                seleccionado: modulosRol.includes(modulo.nombre_modulo)
            }));
            console.log(modulosConEstado)
            res.render('Roles/editarRoles', {
                titulo: 'CosmeTIC | Editar Rol',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Editar Roles',
                lista_modulos: modulosConEstado,
                _id: rolId,
                rol: rol
            });
        } else {
            console.error('Error al obtener los datos del rol:', response.status);
            res.status(response.status).send('Error al obtener los datos del rol');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        res.status(500).send('Error al obtener el rol');
    }
});

// Página de Pedidos

let listaDetalle = [];

app.get('/pedidos', async (req, res) => {
    try {
        const url = "https://apifinal-5pf3.onrender.com/api/pedido";
        const response = await axios.get(url, {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (response.status === 200) {
            const data = response.data;
            const pedidos = data.pedido;
            listaDetalle = []
            res.render('Pedidos/pedidos', {
                titulo: 'CosmeTIC | Pedidos',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Pedidos',
                lista_pedidos: pedidos
            });
        } else {
            console.error("Error al obtener la lista de pedidos:", response.status);
            res.status(response.status).send("Error al obtener la lista de pedidos");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        res.status(500).send("Error al obtener los pedidos");
    }
});

app.post('/cambiarEstadoPedido', async (req, res) => {
    const pedidoId = req.body.pedidoId;
    console.log(pedidoId);
    try {
        const url = `https://apifinal-5pf3.onrender.com/api/pedido/getOne?_id=${pedidoId}`;
        const response = await axios.get(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (response.status === 200) {
            const { numeroPedido, cliente, empleado, fechaPedido, tipoPago, productos, totalPedido } = response.data.pedido;
            const fecha = fechaPedido.slice(0, 10);
            const fechaEntrega = new Date();
            const venta = {
                numeroVenta: numeroPedido,
                cliente: cliente,
                empleado: empleado,
                fechaVenta: fecha,
                fechaEntrega: fechaEntrega,
                tipoPago: tipoPago,
                productos: productos,
                totalVenta: totalPedido,
                estadoVenta: "Por pagar"
            }
            console.log(venta);
            console.log("hola2")
            try {
                const urlVenta = `https://apifinal-5pf3.onrender.com/api/venta`;
                const ventaResponse = await axios.post(urlVenta, venta, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-type': 'application/json; charset=UTF-8' }
                });
                if (ventaResponse.status === 200) {
                    console.log('Venta registrada exitosamente');
                    const eliminarPedidoUrl = 'https://apifinal-5pf3.onrender.com/api/pedido';
                    const eliminarPedidoResponse = await axios.delete(eliminarPedidoUrl, {
                        data: {
                            _id: pedidoId
                        },
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8'
                        }
                    });
                    if (eliminarPedidoResponse.status === 200) {
                        console.log('Pedido eliminado exitosamente');
                        res.json({ msg: 'Cambio de estado realizado con éxito' });
                    } else {
                        console.error('Error al eliminar el pedido:', eliminarPedidoResponse.status);
                    }
                } else {
                    console.error('Error al registrar la venta:', ventaResponse.status);
                    res.status(ventaResponse.status).send('Error al registrar la venta');
                }
            } catch (error) {
                console.error('Error al realizar la solicitud de venta:', error);
                res.status(500).send('Error al registrar la venta');
            }
        } else {
            console.error('Error al obtener los datos del Pedido:', response.status);
            res.status(response.status).send('Error al obtener los datos del Pedido');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud del Pedido:', error);
        res.status(500).send('Error al obtener el Pedido');
    }
});

app.get('/registroPedidos', (req, res) => {
    listaProductos = {
        producto: [{
            _id: 1,
            nombreProducto: 'Labial',
            precioCompra: 5000,
            precioVenta: 6000,
        }, {
            _id: 2,
            nombreProducto: 'Rubor',
            precioCompra: 2000,
            precioVenta: 7000,
        }, {
            _id: 3,
            nombreProducto: 'Base',
            cantidad: 10,
            precioCompra: 5000,
            precioVenta: 9000,
        }],
    };

    res.render('Pedidos/registroPedidos', {
        titulo: 'CosmeTIC | Nuevo Pedido',
        user_name: 'Alejandro Cañas',
        consecutivo: 'Registrar Pedido',
        listaProductos: listaProductos,
        listaDetalle: listaDetalle
    });
});

app.post('/registroPedidos', (req, res) => {
    const data = req.body;
    const _id = data._id;
    const cantidad = data.cantidad;
    listaProductos = {
        producto: [{
            _id: 1,
            nombreProducto: 'Labial',
            precioCompra: 5000,
            precioVenta: 6000,
        }, {
            _id: 2,
            nombreProducto: 'Rubor',
            precioCompra: 2000,
            precioVenta: 7000,
        }, {
            _id: 3,
            nombreProducto: 'Base',
            cantidad: 10,
            precioCompra: 5000,
            precioVenta: 9000,
        }],
    };

    const productoEncontrado = listaProductos.producto.find(producto => producto._id == _id);
    if (productoEncontrado) {
        const productoExistente = listaDetalle.find(detalle => detalle._id === _id);
        if (productoExistente) {
            const mensajeError = 'El producto ya ha sido agregado.';
            res.status(400).json({ error: mensajeError }); 

        const precioTotal = productoEncontrado.precioVenta * cantidad;
        const productoFinal = {
            ...productoEncontrado,
            cantidad: cantidad,
            precioTotal: precioTotal
        };
        listaDetalle.push(productoFinal);
    }
    res.render('Pedidos/registroPedidos', {
        titulo: 'CosmeTIC | Nuevo Pedido',
        user_name: 'Alejandro Cañas',
        consecutivo: 'Registrar Pedido',
        listaProductos: listaProductos,
        listaDetalle: listaDetalle
    });
});

app.post('/eliminarProducto', (req, res) => {
    const productoId = req.body.productoId;
    for (let i = 0; i < listaDetalle.length; i++) {
        console.log("hola");
        if (listaDetalle[i]._id == productoId) {
            listaDetalle.splice(i, 1);
            console.log('Producto eliminado exitosamente');
            break
        }
    }
    res.redirect('/registroPedidos');
});

app.get('/detallePedido', async (req, res) => {
    listaProductos = {
        producto: [{
            _id: 1,
            nombreProducto: 'Labial',
            precioCompra: 5000,
            precioVenta: 6000,
        }, {
            _id: 2,
            nombreProducto: 'Rubor',
            precioCompra: 2000,
            precioVenta: 7000,
        }, {
            _id: 3,
            nombreProducto: 'Base',
            cantidad: 10,
            precioCompra: 5000,
            precioVenta: 9000,
        }],
    };
    try {
        const pedidoId = req.query._id;
        const url = `https://apifinal-5pf3.onrender.com/api/pedido/getOne?_id=${pedidoId}`;
        const response = await axios.get(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (response.status === 200) {
            const pedido = response.data;
            const productos = pedido.pedido.productos;
            const fecha = pedido.pedido.fechaPedido;
            pedido.pedido.fechaPedido = fecha.slice(0, 10);
            res.render('Pedidos/detallePedido', {
                titulo: 'CosmeTIC | Detalle Pedido',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Detalle Pedido',
                detallePedido: pedido,
                listaProductos: listaProductos,
                productos: productos,
                _id: pedidoId
            });
        } else {
            console.error('Error al obtener los datos del Pedido:', response.status);
            res.status(response.status).send('Error al obtener los datos del Pedido');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        res.status(500).send('Error al obtener el Pedido');
    }
});

// Página de Ventas

app.get('/ventas', async (req, res) => {
    try {
        const url = "https://apifinal-5pf3.onrender.com/api/venta";
        const response = await axios.get(url, {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (response.status === 200) {
            const data = response.data;
            const ventas = data.venta;
            console.log(ventas);
            res.render('Ventas/ventas', {
                titulo: 'CosmeTIC | Ventas',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Ventas',
                lista_ventas: ventas
            });
        } else {
            console.error("Error al obtener la lista de ventas:", response.status);
            res.status(response.status).send("Error al obtener la lista de ventas");
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        res.status(500).send("Error al obtener las ventas");
    }
})

app.get('/detalleVenta', async (req, res) => {
    try {
        const ventaId = req.query._id;
        const url = `https://apifinal-5pf3.onrender.com/api/venta/getOne?_id=${ventaId}`;
        const response = await axios.get(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (response.status === 200) {
            const venta = response.data;
            const productos = venta.venta.productos;
            const fecha = venta.venta.fechaVenta;
            const fechaEntrega = venta.venta.fechaEntrega;
            venta.venta.fechaVenta = fecha.slice(0, 10);
            venta.venta.fechaEntrega = fechaEntrega.slice(0, 10);
            res.render('Ventas/detalleVenta', {
                titulo: 'CosmeTIC | Detalle Venta',
                user_name: 'Alejandro Cañas',
                consecutivo: 'Detalle Venta',
                detalleVenta: venta,
                productos: productos
            });
        } else {
            console.error('Error al obtener los datos de la Venta:', response.status);
            res.status(response.status).send('Error al obtener los datos de la Venta');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        res.status(500).send('Error al obtener la Venta');
    }
});

