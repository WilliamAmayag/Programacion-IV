Vue.component('v-select-clientes', VueSelect.VueSelect);
Vue.component('pagar', {
    data: () => {
        return {
            pagares: [],
            clientes: [],
            buscar: '',
            pagar: {
                accion: 'nuevo',
                msg: '',
                idPagar: '',
                fecha : '',
                consumido: '',
                pago : '',

                cliente: {
                    idCliente: '',
                    label: '',
                   
                },
               

            }
        }
    },
    methods: {
        buscarPagar() {
            this.obtenerDatos(this.buscar);
        },
        guardarPagar() {
            var normal = 18;

            this.obtenerDatos();

            if (parseInt(this.pagar.consumido) <= 18){
                this.pagar.pago = 6;
            }

            if (parseInt(this.pagar.consumido) >= 18 && parseInt(this.pagar.consumido) <= 28){
                this.pagar.pago = (this.pagar.consumido - normal) * 0.45 + 6;
                
            }

            if (parseInt(this.pagar.consumido) >= 30 ){
                this.pagar.pago = (10) * 0.45 + 6 + (this.pagar.consumido - 28) * 0.65;
                
            }

            let pagares = JSON.parse(localStorage.getItem('pagares')) || [];
            if (this.pagar.accion == 'nuevo') {
                this.pagar.idPagar = idUnico();
                pagares.push(this.pagar);
            } else if (this.pagar.accion == 'modificar') {
                let index = pagares.findIndex(pagar => pagar.idPagar == this.pagar.idPagar);
                pagares[index] = this.pagar;
            } else if (this.pagar.accion == 'eliminar') {
                let index = pagares.findIndex(pagar => pagar.idPagar == this.pagar.idPagar);
                pagares.splice(index, 1);
            }
            localStorage.setItem('pagares', JSON.stringify(pagares));
            this.pagar.msg = 'Pagar procesado con exito';
            this.nuevoPagar();
            this.obtenerDatos();

        },
        modificarPagar(data) {
            this.pagar = JSON.parse(JSON.stringify(data));
            this.pagar.accion = 'modificar';
        },
        eliminarPagar(data) {
            if (confirm(`¿Esta seguro de eliminar el pago de ${data.cliente['label']} ?`)) {
                this.pagar.idPagar = data.idPagar;
                this.pagar.accion = 'eliminar';
                this.guardarPagar();
            }
        },
        obtenerDatos(busqueda = '') {
            this.pagares = [];
            let pagares = JSON.parse(localStorage.getItem('pagares')) || [];
            this.pagares = pagares.filter(pagar => pagar.cliente['label'].toLowerCase().indexOf(busqueda.toLowerCase())>-1 );


            
            this.clientes = [];
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            this.clientes = clientes.map(cliente => {
                return {
                    idCliente: cliente.idCliente,
                    label: cliente.nombre,
                  
                }
            });

           

          
        },
        nuevoPagar() {
            this.pagar.accion = 'nuevo';
            this.pagar.idPagar = '';
            this.pagar.fecha = '';
            this.pagar.pago = '';
            this.pagar.consumido = '';
            this.pagar.cliente = '';
        }
    },
    created() {
        this.obtenerDatos();
    },
    template: `
    <div id="appPagar">
        <div class="card text-white" id="carPagar">
            <div class="card-header bg-primary">
                Registro de Pagar
                <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carPagar" aria-label="Close"></button>
            </div>
            <div class="card-body text-dark">
                <form method="post" @submit.prevent="guardarPagar" @reset="nuevoPagar">
              
                <div class="row p-1">
                <div class="col col-md-2">Consumido:</div>
                <div class="col col-md-2">
                    <input title="Ingrese fecha" v-model="pagar.consumido" required type="text" class="form-control">
                </div>
            </div>


                <div class="row p-1">
                <div class="col col-md-2">
                    Clientes:
                </div>
                <div class="col col-md-3">
                    <v-select-clientes v-model="pagar.cliente" 
                        :options="clientes" placeholder="Seleccione una categoria"/>
                </div>
            </div>
           
        
                    <div class="row p-1">
                        <div class="col col-md-2">Fecha:</div>
                        <div class="col col-md-2">
                            <input title="Ingrese fecha" v-model="pagar.fecha" required type="text" class="form-control">
                        </div>
                    </div>
                    
                    <div class="row p-1">
                        <div class="col col-md-2">Pago:</div>
                        <div class="col col-md-3">
                            <input title="Ingrese el dia" v-model="pagar.pago"  type="text" class="form-control">
                        </div>
                    </div>
                    
                    <div class="row m-2">
                        <div class="col col-md-5 text-center">
                            <input class="btn btn-success" type="submit" value="Guardar">
                            <input class="btn btn-warning" type="reset" value="Nuevo">
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="card text-white" id="carBuscarPagar">
            <div class="card-header bg-primary">
                Busqueda de Inscriociones
                <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarPagar" aria-label="Close"></button>
            </div>
            <div class="card-body">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th colspan="6">
                                Buscar: <input @keyup="buscarPagar" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                            </th>
                        </tr>
                        <tr>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Consumido</th>
                            <th>Pagos</th>
                        
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in pagares" @click='modificarPagar( item )' :key="item.idPagar">
                        <td>{{item.cliente['label']}}</td>  
                       
                        <td>{{item.fecha}}</td>
                        <td>{{item.consumido}}</td>
                        <td>{{item.pago}}</td>
                           
                        
                            <td>
                                <button class="btn btn-danger" @click="eliminarPagar(item)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`
});