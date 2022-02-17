const db_sistema = openDatabase('db_sistema', '1.0', 'Sistema', 5 * 1024 * 1024);
if (!db_sistema) {
    alert('Lo siento, el navagador no soporta BD offline');
}
Vue.component('estudiantes', {
    data:()=>{
        return {
            word: '',
            students: [],
            student: {
                accion: 'nuevo',
                code: '',
                name: '',
                lastname: '',
                phone: '',
                email: '',
                address: '',
                dui: '',}
        }
    },
    methods: {
        search() {
            this.obtenerEstudiantes(this.word);
        },
        clearForm() {
            this.student.name = ''
            this.student.code = ''
            this.student.lastname = ''
            this.student.phone = ''
            this.student.email = ''
            this.student.address = ''
            this.student.dui = ''
            this.student.accion = 'nuevo'
        },
        saveChanges() {
            let sql = '';
            parametros = [];

            if (this.student.accion == 'nuevo') {
                sql = 'INSERT INTO estudiantes (code, name, lastname, phone, email, address, dui) VALUES (?,?,?,?,?,?,?)';
                parametros = [this.student.code, this.student.name, this.student.lastname, this.student.phone, this.student.email, this.student.address, this.student.dui];
            } else if (this.student.accion == 'modificar') {
                sql = 'UPDATE estudiantes SET code = ?, name = ?, lastname = ?, phone = ?, email = ?, address = ?, dui = ? WHERE idEstudiante = ?';
                parametros = [this.student.code, this.student.name, this.student.lastname,  this.student.phone, this.student.email, this.student.address, this.student.dui, this.student.idEstudiante];
            } else if (this.student.accion == 'eliminar') {
                sql = 'DELETE FROM estudiantes WHERE idEstudiante = ?';
                parametros = [this.student.idEstudiante];
            }
            db_sistema.transaction(tx => {
                tx.executeSql(sql, parametros, (tx, res) => {
                        this.clearForm();
                        this.obtenerEstudiantes('');
                        alert('Registro procesado');
                    },
                    (tx, err) => {
                        alert('Error al procesar el cliente', err.message);
                        console.log(err);
                    });
            });
        },

        eliminarEstudiante(student) {
            if (confirm(`Esta seguro de eliminar el estudiante ${student.name} ${student.lastname}?`)) {
                this.student.idEstudiante = student.idEstudiante;
                this.student.accion = 'eliminar';
                this.saveChanges();
            }
        },
        modificarEstudiante(student) {
            this.student = JSON.parse(JSON.stringify(student));
            this.student.accion = 'modificar';
        },
        obtenerEstudiantes(word) {
            let respuesta = db_sistema.transaction(tx => {
                tx.executeSql(`SELECT * FROM estudiantes WHERE code LIKE "%${word}%" OR name LIKE "%${word}%" OR lastname LIKE "%${word}%" OR birth LIKE "%${word}%" OR phone LIKE "%${word}%" OR email LIKE "%${word}%" OR address LIKE "%${word}%" OR dui LIKE "%${word}%"`, [], (tx, res) => {
                    this.students = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        this.students.push(res.rows.item(i));
                    }
                });
            });

        },
    },
    created(){
        db_sistema.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS estudiantes(idEstudiante INTEGER PRIMARY KEY AUTOINCREMENT, code char(10), name char(100), lastname char(100), phone char(10), email char(100), address char(100), dui char(12))'
            );
        }, err => {
            console.log(err);
        });
        this.obtenerEstudiantes('');
    
    },

    template: `
        <div id='appEstudiante'>
            <form @submit.prevent="saveChanges" @reset.prevent="clearForm" method="post" id="frmEstudiante">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de estudiantes
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmEstudiante" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col col-md-1">Codigo</div>
                            <div class="col col-md-2">
                                <input v-model="student.code" placeholder="codigo" required title="Codigo de estudiante" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Nombre</div>
                            <div class="col col-md-2">
                                <input v-model="student.name" placeholder="nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de estudiante" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                        <div class="col col-md-1">Apellido</div>
                        <div class="col col-md-2">
                            <input v-model="student.lastname" placeholder="apellido" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="apellido de estudiante" class="form-control" type="text">
                        </div>
                    </div>
                    <div class="row p-1">
                            <div class="col col-md-1">Telefono</div>
                            <div class="col col-md-2">
                                <input v-model="student.phone" placeholder="telefono" required title="telefono de estudiante" class="form-control" type="text">
                            </div>
                        </div>


                        <div class="row p-1">
                            <div class="col col-md-1">Correo</div>
                            <div class="col col-md-2">
                                <input v-model="student.email" placeholder="correo"  required title="Correo de estudiante" class="form-control" type="text">
                            </div>
                        </div>

                        <div class="row p-1">
                            <div class="col col-md-1">Direccion</div>
                            <div class="col col-md-2">
                                <input v-model="student.address" placeholder="direccion"  required title="Direccion de estudiante" class="form-control" type="text">
                            </div>
                        </div>

                        <div class="row p-1">
                            <div class="col col-md-1">DUI</div>
                            <div class="col col-md-2">
                                <input v-model="student.dui" placeholder="dui"  required title="DUI de estudiante" class="form-control" type="text">
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
            <div class="card mb-3" id="cardBuscarEstudiante">
                <div class="card-header text-white bg-dark">
                    Busqueda de Estudiantes
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarEstudiante" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <td colspan="6">
                                buscar: <input title="Introduzca el texto a buscar" @keyup="search" v-model="word" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>

                

                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Telefono</th>
                                <th>Correo</th>
                                <th>Direccion</th>

                                <th>DUI</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in students" :key="item.idStudent" @click="modificarEstudiante(item)">
                                <td>{{item.code}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.lastname}}</td>
                                <td>{{item.phone}}</td>
                                <td>{{item.email}}</td>
                                <td>{{item.address}}</td>
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