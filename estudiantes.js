Vue.component('estudiantes', {
    data:()=>{
        return {
            estudiantes: [],
            buscar: '',
            estudiante: {
                accion: 'nuevo',
                msg : '',
                idEstudiante: '',
                codigo: '',
                nombre: '',
                correo: '',
                direccion: '',
                telefono: '',
                dui: ''
            }
        }
    },
    methods: {
        buscarEstudiante(){
            this.obtenerDatos(this.buscar);
        },
        guardarEstudiante(){
            this.obtenerDatos();
            let estudiantes = this.estudiantes || [];
            if( this.estudiante.accion == 'nuevo' ){
                this.estudiante.idEstudiante = idUnicoFecha();
                estudiantes.push(this.estudiante);
            }else if( this.estudiante.accion == 'modificar' ){
                let index = estudiantes.findIndex(estudiante=>estudiante.idEstudiante==this.estudiante.idEstudiante);
                estudiantes[index] = this.estudiante;
            }else if( this.estudiante.accion == 'eliminar' ){
                let index = estudiantes.findIndex(estudiante=>estudiante.idEstudiante==this.estudiante.idEstudiante);
                estudiantes.splice(index,1);
            }
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
            this.estudiante.msg = 'Estudiante procesado con exito';
            this.nuevoEstudiante();
            this.obtenerDatos();
        },
        modificarEstudiante(data){
            this.estudiante = JSON.parse(JSON.stringify(data));
            this.estudiante.accion = 'modificar';
        },
        eliminarEstudiante(data){
            if( confirm(`¿Esta seguro de eliminar el estudiante ${data.nombre}?`) ){
                this.estudiante.idEstudiante = data.idEstudiante;
                this.estudiante.accion = 'eliminar';
                this.guardarEstudiante();
            }
        },
        obtenerDatos(busqueda=''){
            this.estudiantes = [];
            if( localStorage.getItem('estudiantes')!=null ){
                for(let i=0; i<JSON.parse(localStorage.getItem('estudiantes')).length; i++){
                    let data = JSON.parse(localStorage.getItem('estudiantes'))[i];
                    if( this.buscar.length>0 ){
                        if( data.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ){
                            this.estudiantes.push(data);
                        }
                    }else{
                        this.estudiantes.push(data);
                    }
                }
            }
        },
        nuevoEstudiante(){
            this.estudiante.accion = 'nuevo';
            this.estudiante.idEstudiante = '';
            this.estudiante.codigo = '';
            this.estudiante.correo = '';
            this.estudiante.nombre = '';
            this.estudiante.direccion = '';
            this.estudiante.telefono = '';
            this.estudiante.dui = '';
            this.estudiante.msg = '';
        }
    }, 
    created(){
        this.obtenerDatos();
    },
    template: `
        <div id='appEstudiante'>
            <form @submit.prevent="guardarEstudiante" @reset.prevent="nuevoEstudiante" method="post" id="frmEstudiante">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de Estudiantes
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmEstudiante" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                    <div class="row p-1">
                    <div class="col col-md-1">Codigo</div>
                    <div class="col col-md-2">
                        <input v-model="estudiante.codigo" placeholder="codigo" required title="Codigo de estudiante" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">Nombre</div>
                    <div class="col col-md-2">
                        <input v-model="estudiante.nombre" placeholder="nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de estudiante" class="form-control" type="text">
                    </div>
                </div>
               
            <div class="row p-1">
                    <div class="col col-md-1">Telefono</div>
                    <div class="col col-md-2">
                        <input v-model="estudiante.telefono" placeholder="telefono" required title="telefono de estudiante" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">Correo</div>
                    <div class="col col-md-2">
                        <input v-model="estudiante.correo" placeholder="correo"  required title="Correo de estudiante" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">Direccion</div>
                    <div class="col col-md-2">
                        <input v-model="estudiante.direccion" placeholder="direccion"  required title="Direccion de estudiante" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">DUI</div>
                    <div class="col col-md-2">
                        <input v-model="estudiante.dui" placeholder="dui"  required title="DUI de estudiante" class="form-control" type="text">
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
            <div class="card mb-3" id="cardBuscarEstudiante">
                <div class="card-header text-white bg-dark">
                    Busqueda de Estudiantes
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarEstudiante" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <td colspan="7">
                                    Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarEstudiante" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Direccion</th>
                                <th>Telefono</th>
                                <th>Correo</th>
                                <th>DUI</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in estudiantes" :key="item.idEstudiante" @click="modificarEstudiante(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.direccion}}</td>
                                <td>{{item.telefono}}</td>
                                <td>{{item.correo}}</td>
                                <td>{{item.dui}}</td>
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarEstudiante(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});