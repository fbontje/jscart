class Carrito {

    //Añadir producto
    comprarProducto(e){
        e.preventDefault();
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement;
            this.leerDatosProducto(producto);
        }
    }

    //Eliminar el producto 
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }

    //Detalles del Producto
    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo: producto.querySelector('h4').textContent,
            precio: producto.querySelector('.precio span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let producosLocalStorage;
        producosLocalStorage = this.obtenerProductosLocalStorage();
        producosLocalStorage.forEach(function (producoLocalStorage){
            if(producoLocalStorage.id === infoProducto.id){
                producosLocalStorage = producoLocalStorage.id;
            }
        });

        if(producosLocalStorage === infoProducto.id){
            Swal.fire({
                type: 'info',
                text: 'El producto ya está agregado',
                showConfirmButton: false,
                timer: 2000
            })
        }
        else {
            this.insertarCarrito(infoProducto);
        }
        
    }

    //Productos añadidos
    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);
    }

    //Eliminar un producto 
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }

    //Elimina todos los productos
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    //Almacenar en Local Storage
    guardarProductosLocalStorage(producto){
        let productos;
        productos = this.obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS
    obtenerProductosLocalStorage(){
        let producoLocalStorage;

        //Comprobar si hay algo en LS
        if(localStorage.getItem('productos') === null){
            producoLocalStorage = [];
        }
        else {
            producoLocalStorage = JSON.parse(localStorage.getItem('productos'));
        }
        return producoLocalStorage;
    }

    //Mostrar los productos guardados en el LS
    leerLocalStorage(){
        let producosLocalStorage;
        producosLocalStorage = this.obtenerProductosLocalStorage();
        producosLocalStorage.forEach(function (producto){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=70>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let producosLocalStorage;
        producosLocalStorage = this.obtenerProductosLocalStorage();
        producosLocalStorage.forEach(function (producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
                </td>
                <td id='subtotales'>${producto.precio * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    //Eliminar producto por ID del LS
    eliminarProductoLocalStorage(productoID){
        let producosLocalStorage;
        //Obtenemos el arreglo de productos
        producosLocalStorage = this.obtenerProductosLocalStorage();
        //Comparar el id del producto borrado con LS
        producosLocalStorage.forEach(function(producoLocalStorage, index){
            if(producoLocalStorage.id === productoID){
                producosLocalStorage.splice(index, 1);
            }
        });

        //Añadimos el arreglo actual al LS
        localStorage.setItem('productos', JSON.stringify(producosLocalStorage));
    }

    //Eliminar datos del LS
    vaciarLocalStorage(){
        localStorage.clear();
    }

    //Procesar pedido
    procesarPedido(e){
        e.preventDefault();

        if(this.obtenerProductosLocalStorage().length === 0){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El carrito está vacío, agrega algún producto',
                showConfirmButton: false,
                timer: 2000
            })
        }
        else {
            location.href = "compra.html";
        }
    }

    //Calcular montos
    calcularTotal(){
        let producosLocalStorage;
        let total = 0, subtotal = 0;
        producosLocalStorage = this.obtenerProductosLocalStorage();
        for(let i = 0; i < producosLocalStorage.length; i++){
            let element = Number(producosLocalStorage[i].precio * producosLocalStorage[i].cantidad);
            total = total + element;
            
        }
        
        subtotal = parseFloat(total).toFixed(2);
        document.getElementById('subtotal').innerHTML = "$" + subtotal;
        document.getElementById('total').value = "$" + total.toFixed(2);
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, producosLocalStorage;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            producosLocalStorage = this.obtenerProductosLocalStorage();
            producosLocalStorage.forEach(function (producoLocalStorage, index) {
                if (producoLocalStorage.id === id) {
                    producoLocalStorage.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * producosLocalStorage[index].precio);
                }    
            });
            localStorage.setItem('productos', JSON.stringify(producosLocalStorage));
            
        }
        else {
            console.log("click afuera");
        }
    }
}