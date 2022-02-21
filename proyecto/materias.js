Vue.component('materias', {
    data:()=>{
        return {
            word: '',
            materias: [],
            days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
            materia: {
                accion: "nuevo",
                name: '',
                teacher: '',
                room: '',
               
            }
        }
    },
    methods: {
        buscar() {
            this.obtener(this.word);
        },
        limpiar() {
            this.materia.name = '';
            this.materia.teacher = '';
            this.materia.room = '';
            this.materia.accion = 'nuevo';
        },
        guardar() {
            let sql = '';
            parametros = [];

            if (this.materia.accion == 'nuevo') {
                sql = 'INSERT INTO materias (name, teacher, room) VALUES (?,?,?)';
                parametros = [this.materia.name, this.materia.teacher, this.materia.room];
               } else if (this.materia.accion == 'modificar') {
                sql = 'UPDATE materias SET name = ?, teacher = ?, room = ? WHERE idMateria = ?';
                parametros = [this.materia.name, this.materia.teacher, this.materia.room, this.materia.idMateria];
                } else if (this.materia.accion == 'eliminar') {
                sql = 'DELETE FROM materias WHERE idMateria = ?';
                parametros = [this.materia.idMateria];
            }
            db_sistema.transaction(tx => {
                tx.executeSql(sql, parametros, (tx, res) => {
                        this.limpiar();
                        this.obtener('');
                        alert('Registro procesado');
                    },
                    (tx, err) => {
                        alert('Error al procesar materias', err.message);
                        console.log(err);
                    });
            });
        },
        eliminar(materia) {
            if (confirm(`Esta seguro de eliminar la materia ${materia.name}?`)) {
                this.materia.idMateria = materia.idMateria;
                this.materia.accion = 'eliminar';
                this.guardar();
            }
        },
        modificar(materia) {
            this.materia = JSON.parse(JSON.stringify(materia));
            this.materia.accion = 'modificar';
        },
        obtener(word) {
            db_sistema.transaction(tx => {
                tx.executeSql(`SELECT * FROM materias WHERE name LIKE '%${word}%'`, [], (tx, res) => {
                    this.materias = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        this.materias.push(res.rows.item(i));
                    }
                }, (tx, err) => {
                    alert('Error al obtener materias', err.message);
                    console.log(err);
                });
            });
        }
    },
           
    created() {
        db_sistema.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Materias(idMateria INTEGER PRIMARY KEY AUTOINCREMENT, name char(100), teacher char(100), room char(100))'
            );
        }, err => {
            console.log(err);
        });
        this.obtener('');
    },

    template: `
        <div id='appMaterias'>
            <form @submit.prevent="guardar" @reset.prevent="limpiar" method="post" id="frmMaterias">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de materias
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmMaterias" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col col-md-1">Materia</div>
                            <div class="col col-md-2">
                                <input v-model="materia.name" placeholder="materia" required title="nomvbre de materia" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Maestro</div>
                            <div class="col col-md-2">
                                <input v-model="materia.teacher" placeholder="maestro" required title="Nombre de estudiante" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                        <div class="col col-md-1">Salon</div>
                        <div class="col col-md-2">
                            <input v-model="materia.room" placeholder="apellido"  required title="apellido de estudiante" class="form-control" type="text">
                        </div>
                    </div>
                 


                    
                        
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="reset" class="btn btn-warning">Limpiar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card mb-3" id="cardBuscarMaterias">
                <div class="card-header text-white bg-dark">
                    Busqueda de materias
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarMaterias" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <td colspan="6">
                                buscar: <input title="Introduzca el texto a buscar" @keyup="buscar" v-model="word" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>

                

                                <th>Materia</th>
                                <th>Profesor</th>
                                <th>Salon</th>
                            
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in materias" :key="item.idMateria" @click="modificar(item)">
                                <td>{{item.name}}</td>
                                <td>{{item.teacher}}</td>
                                <td>{{item.room}}</td>
                              
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminar(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});