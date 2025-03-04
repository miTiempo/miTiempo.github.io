//-----------------------------------------------------------------------------------------------------------------------------------
// Variables globales
//-------------------------------------------------------------------------------------------------------------------------------------
const seleccionarTarea=document.getElementById("select-tipo-tarea");
const duracion_cuenta_regresiva=24000;
const duracion_cambio_actividad=5000;

var idActividad;
var idTarea;
var idTransicion;
var idContar;
var idCorte;
var idFin;

var tiempo_total_actividades=0;
var tiempo_tarea_anterior=0;
var listado_tareas=[];
var numeros=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once"];
var numerosAudio=[];



//-----------------------------------------------------------------------------------------------------------------------------------
function reproducirCambioHora(horas) {
//---------------------------------------------------------------------------------------------------------------------
   let texto="Son las "+horas;

   if ('speechSynthesis' in window) {                                          
                        // Creamos un nuevo objeto de síntesis de voz
      convertirTextoAVoz(texto);                                // Llamamos a la función para convertir texto a voz
} else {
      console.log('Lo siento, tu navegador no soporta la API de síntesis de voz.'); // El navegador no soporta la API de síntesis de voz
}
}
//-------------------------------------------------------------------------------------------------------------------------------------------
function esCambioHora(ahora) {
//---------------------------------------------------------------------------------------------------------------------   
   const minutos = ahora.getMinutes();
   const segundos = ahora.getSeconds();

   // Verifica si es exactamente las 12:00:00 PM
   return (minutos === 0 && segundos === 0) 
}

 //---------------------------------------------------------------------------------------------------------------------------------
function verificarHora(){
//---------------------------------------------------------------------------------------------------------------------   
   const ahora = new Date();
   const horas = ahora.getHours();

   if (esCambioHora(ahora)) {
      reproducirCambioHora(horas);
      
   }
};
//-----------------------------------------------------------------------------------------------------------------------------------
document.getElementById('boton-activar-aviso-hora').addEventListener('click', function() {    
//---------------------------------------------------------------------------------------------------------------------
   const boton = document.getElementById("boton-activar-aviso-hora");
   let estado;
         
   if (boton.innerHTML === "Desactivado") {
      boton.innerHTML = "Activado";
      estado=setInterval(verificarHora, 1000); // Verifica la hora cada segundo 
   } else {
      boton.innerHTML = "Desactivado";
      clearInterval(estado);
   }

   boton.classList.toggle("boton_presionado");
   
}
);


 //---------------------------------------------------------------------------------------------------------------------------
function obtieneValoresInputs(){
//---------------------------------------------------------------------------------------------------------------------
   const transiciones=parseInt(document.getElementById("select-transicion").value);
   const tiempo_vuelta=(document.getElementById("input-tiempo-productivo-horas").value*3600000)+(document.getElementById("input-tiempo-productivo-minutos").value*60000)+(document.getElementById("input-tiempo-productivo-segundos").value*1000);
   const vueltas=parseInt(document.getElementById("input-vueltas").value);
   const tiempo_tarea =((tiempo_vuelta+transiciones)*vueltas)+duracion_cuenta_regresiva+duracion_cambio_actividad; 
   var valores={
      tipo_tarea: document.getElementById("select-tipo-tarea").value,
      nombre:document.getElementById('nombre-tarea').value,
      vueltas: vueltas,
      tiempo_vuelta:tiempo_vuelta,
      tiempo_corte:(tiempo_vuelta/2).toFixed(2),
      transiciones:transiciones,
      tiempo_conteo:(transiciones/3).toFixed(2),
      tiempo_tarea:tiempo_tarea
   }

   return valores; 

}

//-----------------------------------------------------------------------------------------------------------------------------------
function milisegActuales() {
//---------------------------------------------------------------------------------------------------------------------
   const ahora = new Date();
   const horas = ahora.getHours()*3600000;;
   const minutos = ahora.getMinutes()*60000;
   const segundos = ahora.getSeconds()*1000;

   return(horas+minutos+segundos);
   
}
//-----------------------------------------------------------------------------------------------------------------------------------
function milisegundosAHMS(milisegundos) {// devuelve en formato texto una hora y los minutos
//---------------------------------------------------------------------------------------------------------------------
   var segundos = Math.floor((milisegundos / 1000) % 60);
   var minutos = Math.floor((milisegundos / (1000 * 60)) % 60);
   var horas = Math.floor((milisegundos / (1000 * 60 * 60)) % 24);
   var dias = Math.floor(milisegundos / (1000 * 60 * 60 * 24));

    // Crear el formato de tiempo
   var formato = "";
   if (dias > 0) {
      formato += dias + "d " + (dias !== 1 ? "s" : "") + " ";
   }
   formato += horas.toString().padStart(2, '0') + ":" +
               minutos.toString().padStart(2, '0') + ":" +
               segundos.toString().padStart(2, '0');

   return formato;
};


//----------------------------------------------------------------------------------------------------------------------------------
function actualizaTiempoFinalizacion(tiempo){
//---------------------------------------------------------------------------------------------------------------------
   const finaliza= milisegActuales()+tiempo;

   if(finaliza>8.64e+7){
      console.log("es un cambio de dia ");
   }
   document.getElementById("tiempo-finalizacion").innerHTML="Finaliza: "+milisegundosAHMS(finaliza)+ " hs";

   return finaliza;
}

//-------------------------------------------------------------------------------------------------------------------------------------
function actualizarTiempoTotalTarea() {
//---------------------------------------------------------------------------------------------------------------------
   const tiempo_total_tarea = document.getElementById("tiempo-total-tarea");    
   tiempo_total_tarea.innerHTML = milisegundosAHMS(obtieneValoresInputs().tiempo_tarea);

}

//-----------------------------------------------------------------------------------------------------------------------------------
function actualizarTiempoActividad(){
   document.getElementById('tiempo-total-vuelta').innerHTML=milisegundosAHMS((duracion_cuenta_regresiva+((tiempo_total)*vueltas_totales)));
// revisar cuentaregresiva5

}


//------------------------------------------------------------------------------------------------------------------------------------------

function convertirTextoAVoz(texto) {                       // Función para convertir texto a voz
   var synthesis = window.speechSynthesis;        
   var utterance = new SpeechSynthesisUtterance(texto);  // Creamos un nuevo objeto de síntesis de voz
   synthesis.speak(utterance);                           // Reproducimos el audio generado
}
//-------------------------------------------------------------------------------------------------------------------------------
function textoAVoz(texto) {                      
   var sintesisDevoz = new SpeechSynthesisUtterance(texto);  // Creamos un nuevo objeto de síntesis de voz
   return sintesisDevoz;                        
}

//-------------------------------------------------------------------------------------------------------------------------------
function creaArregloAudios(conteo) {
   for(let i=0;i<=conteo;i++){
      numerosAudio.push(textoAVoz(numeros[i]));
   } 
};
//----------------------------------------------------------------------------------------------------
function contar(voz,conteo,duracion){
   if(conteo>0){
      //convertirTextoAVoz(numeros[conteo]);
      voz.speak(numerosAudio[conteo]);
      conteo--;
      if(conteo!=0){
      idContar=setTimeout(function(){contar(voz,conteo,duracion) },duracion );
      }
   } 

};
//-------------------------------------------------------------------------------------------------------------------------------

function tarea(voz,tiempo_vuelta,tiempo_corte,transicion,tiempo_conteo,vueltas,vueltas_totales) {
   
   
   if(vueltas<=vueltas_totales){  //reever esto

      idCorte=setTimeout(function (){convertirTextoAVoz("Cambio") }, (tiempo_corte));
      idTransicion=setTimeout(function(){contar(voz,3,tiempo_conteo) ;},tiempo_vuelta);

      if (vueltas==vueltas_totales){
         convertirTextoAVoz("ultima vuelta");
         idFin=setTimeout(function(){convertirTextoAVoz("Terminamos")},tiempo_vuelta+transicion);
      
      }else{   

         vueltas++;          
         idTarea=setTimeout(function(){tarea(voz,tiempo_vuelta,tiempo_corte,transicion,tiempo_conteo,vueltas,vueltas_totales);}, tiempo_vuelta+transicion);
      } 
   }
};  

//---------------------------------------------------------------------------------------------------------------------------------------------

function iniciarActividad(voz,conteo,duracion_conteo,inicio,fin){  //duracion conteo duracion_cuenta_regresiva/10
   if (inicio<fin){
      
      let tiempo_total_tarea=listado_tareas[inicio].tiempo_tarea;
      let vueltas_totales=listado_tareas[inicio].vueltas;
      let tiempo_vuelta=listado_tareas[inicio].tiempo_vuelta;
      let tiempo_corte=listado_tareas[inicio].tiempo_corte;
      let tiempo_transicion=listado_tareas[inicio].transiciones; 
      let tiempo_conteo=listado_tareas[inicio].tiempo_conteo; 
      
      convertirTextoAVoz(listado_tareas[inicio].tipo_tarea);
      contar(voz,conteo,duracion_conteo) ;
      
      idTarea=setTimeout(function (){tarea(voz,tiempo_vuelta,tiempo_corte,tiempo_transicion,tiempo_conteo,1,vueltas_totales);},duracion_cuenta_regresiva);
      inicio++;      
      idActividad=setTimeout(function (){iniciarActividad(voz,conteo,duracion_conteo,inicio,fin)},tiempo_total_tarea);
   }
   else{
      convertirTextoAVoz("Finalizamos la actividad");
      document.getElementById('boton-iniciar-tareas').classList.toggle("boton_presionado");   
      document.getElementById('boton-iniciar-tareas').innerHTML="Iniciar";  
}   
};


//---------------------------------------------------------------------------------------------------------------------


function detenerAudios() {
   let audio = document.getElementById('cuentaregresiva5');
   let audio2 = document.getElementById('cuentaregresiva10');
   audio.pause();
   audio.currentTime = 0;
   audio2.pause();
   audio2.currentTime = 0;
};


//-------------------------------------------------------------------------------------------------------------------------------


document.getElementById("boton-agregar-tarea").addEventListener("click",function () {
   let ul =document.getElementById('lista-tareas');
   let valores=obtieneValoresInputs();
   listado_tareas.push(valores);

   ul.insertAdjacentHTML('beforeend',`<li> <b> ${valores.tipo_tarea}</b> (Tiempo: ${milisegundosAHMS(valores.tiempo_tarea)})  > <b>Inicia:</b> ${milisegundosAHMS(tiempo_total_actividades+milisegActuales())} - <b>Finaliza:</b> ${milisegundosAHMS(milisegActuales()+tiempo_total_actividades+valores.tiempo_tarea)}</li>`);
   
   tiempo_total_actividades+=valores.tiempo_tarea;
   tiempo_tarea_anterior=valores.tiempo_tarea;
   
   actualizaTiempoFinalizacion(tiempo_total_actividades );
   console.log("Tiempo total de actividades "+milisegundosAHMS(tiempo_total_actividades));
   document.getElementById("boton-iniciar-tareas").disabled=false;
   document.getElementById("boton-iniciar-tareas").style.display = "block";   
}
);

//-------------------------------------------------------------------------------------------------------------------------------

document.getElementById("boton-quitar-tarea").addEventListener("click",function () {
   if(listado_tareas.length>0){

   tiempo_total_actividades-=tiempo_tarea_anterior;
   actualizaTiempoFinalizacion(tiempo_total_actividades );
   document.getElementById('lista-tareas').lastElementChild.remove();
   if(listado_tareas.length===1)
         {document.getElementById("tiempo-finalizacion").innerHTML="";
         document.getElementById("boton-iniciar-tareas").disabled=true;
         document.getElementById("boton-iniciar-tareas").style.display = "none";  
         }
   listado_tareas.pop();
   console.log("Tiempo total de actividades "+milisegundosAHMS(tiempo_total_actividades));

   }
   
}
);

//------------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("boton-iniciar-tareas").addEventListener("click",function () {

   let boton = document.getElementById("boton-iniciar-tareas");
   var sintesis_voz = window.speechSynthesis; 
   const conteo=10; 
   creaArregloAudios(conteo);

   if (boton.innerHTML === "Iniciar") {
      actualizaTiempoFinalizacion(tiempo_total_actividades);
      iniciarActividad(sintesis_voz,conteo,duracion_cuenta_regresiva/conteo,0,listado_tareas.length);
      boton.innerHTML = "Finalizar";
   } else {
      clearTimeout(idActividad);
      clearTimeout(idTarea);
      clearTimeout(idTransicion);
      clearTimeout(idContar);
      clearTimeout(idCorte);
      clearTimeout(idFin);
      boton.innerHTML = "Iniciar";
   
   }

   boton.classList.toggle("boton_presionado");   

   

}
);


//--------------------------------------------------------------------------------------------------------------------------------------

function actualizarInputs(vueltas,horas,minutos,segundos){
   document.getElementById("input-vueltas").value=vueltas;
   document.getElementById("input-tiempo-productivo-horas").value=horas;
   document.getElementById("input-tiempo-productivo-minutos").value=minutos;
   document.getElementById("input-tiempo-productivo-segundos").value=segundos;

   actualizarTiempoTotalTarea();
};

//------------------------------------------------------------------------------------------------------------------
seleccionarTarea.addEventListener('change',function (){

   var pos_seleccionado = seleccionarTarea.selectedIndex;
   var seleccionado = seleccionarTarea[pos_seleccionado];
   var selectedText = seleccionado.textContent;

     if (selectedText==="Meditación")
      actualizarInputs(1,0,3,0);
     else
         if(selectedText==="Yoga")
           actualizarInputs(25,0,1,10);
         else
            if(selectedText==="Tiempo libre")
               actualizarInputs(2,0,0,20);
            else
               actualizarInputs(2,0,40,40);

     
  
}
);

//--------------------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
  
   const input = document.getElementById("input-vueltas");
   const inputh = document.getElementById("input-tiempo-productivo-horas");
   const inputm = document.getElementById("input-tiempo-productivo-minutos");
   const inputs = document.getElementById("input-tiempo-productivo-segundos");
   const selectt = document.getElementById("select-transicion");
  
   input.addEventListener("input", actualizarTiempoTotalTarea);
   inputh.addEventListener("input", actualizarTiempoTotalTarea);
   inputm.addEventListener("input", actualizarTiempoTotalTarea);
   inputs.addEventListener("input", actualizarTiempoTotalTarea);
   selectt.addEventListener("input", actualizarTiempoTotalTarea);
}
);

