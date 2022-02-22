var idUnico = ()=>{
    let fecha = new Date();
    return Math.floor(fecha.getTime()/1000).toString(16);
};
var app = new Vue({
    el: '#appSistema',
    data: {
       forms:{
           'clientes':{ mostrar: false },
           'pagar':{ mostrar: false },
       }
    },
    methods: {
        
    },
    created(){
       
    }
});
document.addEventListener('DOMContentLoaded', event=>{
    let $element = document.querySelectorAll('.mostrar').forEach( (element,index)=>{
        element.addEventListener('click', e=>{
            app.forms[e.target.dataset.form].mostrar = true;
        });
    });
});