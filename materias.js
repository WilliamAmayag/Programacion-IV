Vue.component('materias', {
    data:()=>{
        return {
            materias: [],
            buscar: '',
            materia: {
                accion: 'nuevo',
                msg : '',
                idMateria: '',
                codigo: '',
                nombre: '',
                docente: '',
                salon: '',
            }
        }
    },
    methods: {
        buscarMateria(){
            this.obtenerDatos(this.buscar);
        },
        guardarMateria(){
            this.obtenerDatos();
            let materias = this.materias || [];
            if( this.materia.accion == 'nuevo' ){
                this.materia.idMateria = idUnicoFecha();
                materias.push(this.materia);
            }else if( this.materia.accion == 'modificar' ){
                let index = materias.findIndex(materia=>materia.idMateria==this.materia.idMateria);
                materias[index] = this.materia;
            }else if( this.materia.accion == 'eliminar' ){
                let index = materias.findIndex(materia=>materia.idMateria==this.materia.idMateria);
                materias.splice(index,1);
            }
            localStorage.setItem('materias', JSON.stringify(materias));
            this.materia.msg = 'Materia procesado con exito';
            this.nuevoMateria();
            this.obtenerDatos();
        },
        modificarMateria(data){
            this.materia = JSON.parse(JSON.stringify(data));
            this.materia.accion = 'modificar';
        },
        eliminarMateria(data){
            if( confirm(`¿Esta seguro de eliminar el materia ${data.nombre}?`) ){
                this.materia.idMateria = data.idMateria;
                this.materia.accion = 'eliminar';
                this.guardarMateria();
            }
        },
        obtenerDatos(busqueda=''){
            this.materias = [];
            if( localStorage.getItem('materias')!=null ){
                for(let i=0; i<JSON.parse(localStorage.getItem('materias')).length; i++){
                    let data = JSON.parse(localStorage.getItem('materias'))[i];
                    if( this.buscar.length>0 ){
                        if( data.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ){
                            this.materias.push(data);
                        }
                    }else{
                        this.materias.push(data);
                    }
                }
            }
        },
        nuevoMateria(){
            this.materia.accion = 'nuevo';
            this.materia.idMateria = '';
            this.materia.codigo = '';
            this.materia.docente = '';
            this.materia.nombre = '';
            this.materia.salon = '';
            this.materia.msg = '';
        }
    }, 
    created(){
        this.obtenerDatos();
    },
    template: `
        <div id='appMateria'>
            <form @submit.prevent="guardarMateria" @reset.prevent="nuevoMateria" method="post" id="frmMateria">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de Materias
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmMateria" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                    <div class="row p-1">
                    <div class="col col-md-1">Codigo</div>
                    <div class="col col-md-2">
                        <input v-model="materia.codigo" placeholder="codigo" required title="Codigo de materia" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">Nombre</div>
                    <div class="col col-md-2">
                        <input v-model="materia.nombre" placeholder="nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de materia" class="form-control" type="text">
                    </div>
                </div>
               
            <div class="row p-1">
                    <div class="col col-md-1">Docente</div>
                    <div class="col col-md-2">
                        <input v-model="materia.docente" placeholder="docente" required title="telefono de materia" class="form-control" type="text">
                    </div>
                </div>
                <div class="row p-1">
                    <div class="col col-md-1">Salon</div>
                    <div class="col col-md-2">
                        <input v-model="materia.salon" placeholder="salon"  required title="Correo de materia" class="form-control" type="text">
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
            <div class="card mb-3" id="cardBuscarMateria">
                <div class="card-header text-white bg-dark">
                    Busqueda de Materias
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarMateria" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <td colspan="7">
                                    Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarMateria" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Docente</th>
                                <th>Salon</th>
                            
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in materias" :key="item.idMateria" @click="modificarMateria(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.docente}}</td>
                                <td>{{item.salon}}</td>
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarMateria(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});