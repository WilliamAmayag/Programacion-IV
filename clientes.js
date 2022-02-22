Vue.component('clientes', {
    data:()=>{
        return {
            clientes: [],
            buscar: '',
            cliente: {
                accion: 'nuevo',
                msg : '',
                idCliente: '',
                codigo: '',
                nombre: '',
            
                direccion: '',
                zona: '',
                
            }
        }
    },
    methods: {
        buscarCliente(){
            this.obtenerDatos(this.buscar);
        },
        guardarCliente(){
            this.obtenerDatos();
            let clientes = this.clientes || [];
            if( this.cliente.accion == 'nuevo' ){
                this.cliente.idCliente = idUnico();
                clientes.push(this.cliente);
            }else if( this.cliente.accion == 'modificar' ){
                let index = clientes.findIndex(cliente=>cliente.idCliente==this.cliente.idCliente);
                clientes[index] = this.cliente;
            }else if( this.cliente.accion == 'eliminar' ){
                let index = clientes.findIndex(cliente=>cliente.idCliente==this.cliente.idCliente);
                clientes.splice(index,1);
            }
            localStorage.setItem('clientes', JSON.stringify(clientes));
            this.cliente.msg = 'Cliente procesado';
            this.nuevoCliente();
            this.obtenerDatos();
        },
        modificarCliente(data){
            this.cliente = JSON.parse(JSON.stringify(data));
            this.cliente.accion = 'modificar';
        },
        eliminarCliente(data){
            if( confirm(`¿Esta seguro de eliminar el cliente ${data.nombre}?`) ){
                this.cliente.idCliente = data.idCliente;
                this.cliente.accion = 'eliminar';
                this.guardarCliente();
            }
        },
        obtenerDatos(busqueda=''){
            this.clientes = [];
            if( localStorage.getItem('clientes')!=null ){
                for(let i=0; i<JSON.parse(localStorage.getItem('clientes')).length; i++){
                    let data = JSON.parse(localStorage.getItem('clientes'))[i];
                    if( this.buscar.length>0 ){
                        if( data.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
                        data.codigo.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
                        data.zona.toLowerCase().indexOf(this.buscar.toLowerCase())>-1){
                            this.clientes.push(data);
                        }
                    }else{
                        this.clientes.push(data);
                    }
                }
            }
        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.idCliente = '';
            this.cliente.codigo = '';
                     this.cliente.nombre = '';
            this.cliente.direccion = '';
                       this.cliente.msg = '';
        }
    }, 
    created(){
        this.obtenerDatos();
    },
    template: `
        <div id='appCliente'>
            <form @submit.prevent="guardarCliente" @reset.prevent="nuevoCliente" method="post" id="frmCliente">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de Clientes
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmCliente" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                    <div class="row p-1">
                    <div class="col col-md-1">Codigo</div>
                    <div class="col col-md-2">
                        <input v-model="cliente.codigo" placeholder="codigo" required title="Codigo de cliente" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">Nombre</div>
                    <div class="col col-md-2">
                        <input v-model="cliente.nombre" placeholder="nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de cliente" class="form-control" type="text">
                    </div>
                </div>
               
           
               
                <div class="row p-1">
                    <div class="col col-md-1">Direccion</div>
                    <div class="col col-md-2">
                        <input v-model="cliente.direccion" placeholder="direccion"  required title="Direccion de cliente" class="form-control" type="text">
                    </div>

                    <div class="row p-1">
                    <div class="col col-md-1">Zona</div>
                    <div class="col col-md-2">
                        <input v-model="cliente.zona" placeholder="zona"  required title="Zona de cliente" class="form-control" type="text">
                    </div>

                    </div>
                    
                </div>

              
               
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="reset" class="btn btn-warning">Nuevo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card mb-3" id="cardBuscarCliente">
                <div class="card-header text-white bg-dark">
                    Busqueda de Clientes
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarCliente" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <td colspan="7">
                                    Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarCliente" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Direccion</th>
                                <th>Zona</th>
                                
                            
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in clientes" :key="item.idCliente" @click="modificarCliente(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.direccion}}</td>
                                <td>{{item.zona}}</td>
                            
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarCliente(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});