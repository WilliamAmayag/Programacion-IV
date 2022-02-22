Vue.component('v-select-estudiantes', VueSelect.VueSelect);
Vue.component('v-select-materias', VueSelect.VueSelect);
Vue.component('inscripciones', {
    data: () => {
        return {
            inscripciones: [],
            estudiantes: [],
            materias: [],
            buscar: '',
            inscripcion: {
                accion: 'nuevo',
                msg: '',
                idInscripcion: '',
                codigo: '',
                dia: '',

                estudiante: {
                    idEstudiante: '',
                    label: '',
                    dui: '',
                },

                materia: {
                    idMateria: '',
                    label: '',
                    docente: '',
                },

            }
        }
    },
    methods: {
        buscarInscripcion() {
            this.obtenerDatos(this.buscar);
        },
        guardarInscripcion() {
            this.obtenerDatos();
            let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
            if (this.inscripcion.accion == 'nuevo') {
                this.inscripcion.idInscripcion = idUnicoFecha();
                inscripciones.push(this.inscripcion);
            } else if (this.inscripcion.accion == 'modificar') {
                let index = inscripciones.findIndex(inscripcion => inscripcion.idInscripcion == this.inscripcion.idInscripcion);
                inscripciones[index] = this.inscripcion;
            } else if (this.inscripcion.accion == 'eliminar') {
                let index = inscripciones.findIndex(inscripcion => inscripcion.idInscripcion == this.inscripcion.idInscripcion);
                inscripciones.splice(index, 1);
            }
            localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
            this.inscripcion.msg = 'Inscripcion procesado con exito';
            this.nuevoInscripcion();
            this.obtenerDatos();

        },
        modificarInscripcion(data) {
            this.inscripcion = JSON.parse(JSON.stringify(data));
            this.inscripcion.accion = 'modificar';
        },
        eliminarInscripcion(data) {
            if (confirm(`¿Esta seguro de eliminar la inscripcion de ${data.estudiante['label']} con la materia ${data.materia['label']} ?`)) {
                this.inscripcion.idInscripcion = data.idInscripcion;
                this.inscripcion.accion = 'eliminar';
                this.guardarInscripcion();
            }
        },
        obtenerDatos(busqueda = '') {
            this.inscripciones = [];
            let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
            this.inscripciones = inscripciones.filter(inscripcion => inscripcion.codigo.toLowerCase().indexOf(busqueda.toLowerCase()) > -1);

            this.estudiantes = [];
            let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
            this.estudiantes = estudiantes.map(estudiante => {
                return {
                    idEstudiante: estudiante.idEstudiante,
                    label: estudiante.nombre,
                    dui: estudiante.dui,
                }
            });

            this.materias = [];
            let materias = JSON.parse(localStorage.getItem('materias')) || [];
            this.materias = materias.map(materia => {
                return {
                    idMateria: materia.idMateria,
                    label: materia.nombre,
                    docente: materia.docente,
                }
            });

          
        },
        nuevoInscripcion() {
            this.inscripcion.accion = 'nuevo';
            this.inscripcion.idInscripcion = '';
            this.inscripcion.codigo = '';
            this.inscripcion.dia = '';
            this.inscripcion.estudiante = '';
            this.inscripcion.materia= '';

        }
    },
    created() {
        this.obtenerDatos();
    },
    template: `
    <div id="appInscripcion">
        <div class="card text-white" id="carInscripcion">
            <div class="card-header bg-primary">
                Registro de Inscripcion
                <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carInscripcion" aria-label="Close"></button>
            </div>
            <div class="card-body text-dark">
                <form method="post" @submit.prevent="guardarInscripcion" @reset="nuevoInscripcion">
              

                
                <div class="row p-1">
                <div class="col col-md-2">
                    Estudiantes:
                </div>
                <div class="col col-md-3">
                    <v-select-estudiantes v-model="inscripcion.estudiante" 
                        :options="estudiantes" placeholder="Seleccione una categoria"/>
                </div>
            </div>



            <div class="row p-1">
            <div class="col col-md-2">
                Materias:
            </div>
            <div class="col col-md-3">
                <v-select-materias v-model="inscripcion.materia" 
                    :options="materias" placeholder="Seleccione una categoria"/>
            </div>
        </div>

        
                    <div class="row p-1">
                        <div class="col col-md-2">Codigo:</div>
                        <div class="col col-md-2">
                            <input title="Ingrese el codigo" v-model="inscripcion.codigo" required type="text" class="form-control">
                        </div>
                    </div>
                    
                    <div class="row p-1">
                        <div class="col col-md-2">Dia:</div>
                        <div class="col col-md-3">
                            <input title="Ingrese el dia" v-model="inscripcion.dia"  required type="text" class="form-control">
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
        <div class="card text-white" id="carBuscarInscripcion">
            <div class="card-header bg-primary">
                Busqueda de Inscriociones
                <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarInscripcion" aria-label="Close"></button>
            </div>
            <div class="card-body">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th colspan="6">
                                Buscar: <input @keyup="buscarInscripcion" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>Dia</th>
                            <th>Estudiante</th>
                            <th>Materia</th>
                            <th>Docente</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in inscripciones" @click='modificarInscripcion( item )' :key="item.idInscripcion">
                            <td>{{item.codigo}}</td>
                            <td>{{item.dia}}</td>
                            <td>{{item.estudiante['label']}}</td>
                            <td>{{item.materia['label']}}</td>
                            <td>{{item.materia['docente']}}</td>
                            <td>
                                <button class="btn btn-danger" @click="eliminarInscripcion(item)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`
});