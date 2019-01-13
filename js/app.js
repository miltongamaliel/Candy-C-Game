$(function(){
//Función destinada para hacer cambiar de color de forma cíclica al elemento
//".main-titulo"
  var a = numeroAleatorio();
  a = a*100;
  setInterval(function(){
    var color=$(".main-titulo").css("color");
    if(color=="rgb(220, 255, 14)")
    {
      $(".main-titulo").css("color","white");
    }
    else
    {
      $(".main-titulo").css("color","#DCFF0E");
    }
  },a);
})
var rbh=0;
var rbv=0;
var bnewd=0;
var lencol=["","","","","","",""];
var lenres=["","","","","","",""];
var maximo=0;
var elementosEnTabla=0;

var tiempoDeDespazamiento=0;
var tiempoEliminar=0;
var agregaDulces=0;
var tiempo=0;

var i=0;
var contador=0;
var conc1=0;

var initialPos;
var espera=0;
var scoreTablero=0;
var mov=0;

var min=2;
var seg=0;
// Por medio del evento .click se monitorea al botón iniciar.
$(".btn-reinicio").click(function(){
  i=0;
  scoreTablero=0;
  mov=0;
  $(".panel-scoreTablero").css("width","25%");
  $(".panel-tablero").show();
  $(".time").show();

  $("#scoreTablero-text").html("0")
  $("#movimientos-text").html("0")
  $(this).html("REINICIAR")
  clearInterval(tiempoDeDespazamiento);
  clearInterval(tiempoEliminar);
  clearInterval(agregaDulces);
  clearInterval(tiempo);
  min=2;  //2
  seg=0;  //0
  borrartotal()
  tiempoDeDespazamiento=setInterval(function(){desplazamiento()},300)
  tiempo=setInterval(function(){timer()},700)
})

// Esta función se encarga de contar descendentemente cada segundo transcurrido. La actualización del contador se hizo searando el string en un arreglo de caracteres independientes.
  function timer(){
  var segundero = $("#timer").text();
  var segunderoArreglo = segundero.toString().split('');
// El ´rimer condicional, una vez que se cumplan los dos minutos de juego esconderá el contenedor con dulces y ampliará el score del juego.
  if(segunderoArreglo[1]==0 && segunderoArreglo[3]==0 && segunderoArreglo[4] ==0 ){
    $(".panel-tablero").slideUp(500,"swing",iniciaJuego.FinalizaTiempo());

  }else if(segunderoArreglo[3]==0 &&segunderoArreglo[4]==0 && segunderoArreglo[1]!=0){
    segunderoArreglo[3] = 5;
    segunderoArreglo[4] = 9;
    segunderoArreglo[1] = segunderoArreglo[1]-1;
    $("#timer").text(segunderoArreglo.join(''));
  }else if (segunderoArreglo[4] == 0 ){
      segunderoArreglo[3] = segunderoArreglo[3] -1;
      segunderoArreglo[4] = 9;
      $("#timer").text(segunderoArreglo.join(''));
    } else if (segunderoArreglo[4] !=0){
      segunderoArreglo[4] = segunderoArreglo[4] -1;
      $("#timer").text(segunderoArreglo.join(''));
    }
  }
//----------Funcion de borrado--------------------------------------------------
function borrartotal()
{
  for(var j=1;j<8;j++)
  {
    $(".col-"+j).children("img").detach();
  }
}
//---------------Funcion inicial para llenar el cuadro del juego----------------
function desplazamiento()
{
  i=i+1
  var numero=0;
  var imagen=0;

  $(".elemento").draggable({ disabled: true });
  if(i<8)
  {
    for(var j=1;j<8;j++)
    {
      if($(".col-"+j).children("img:nth-child("+i+")").html()==null)
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
      }
    }
  }
  if(i==8)
  {
    clearInterval(tiempoDeDespazamiento);   //desactivar funcion desplazamiento()
    tiempoEliminar=setInterval(function(){tiempoEliminarhorver()},150)  //activar funcion tiempoEliminarhorver
  }
}
//------------------------------------------------------------------------------
//---------------Funcion para tiempoEliminar mas de 3 dulces--------------------------
function tiempoEliminarhorver()
{
  elementosEnTabla=0;
  rbh=horizontal()  //funcion busqueda dulces horizontal
  rbv=vertical()    //funcion buscar dulces vertical

  for(var j=1;j<8;j++)
  {
      elementosEnTabla=elementosEnTabla+$(".col-"+j).children().length;
  }

  if(rbh==0 && rbv==0 && elementosEnTabla!=49)  //condicion si no encuentra 3 dulces o mas llamar a funcion para volver a completar el uego
  {
      clearInterval(tiempoEliminar);
      bnewd=0;
      agregaDulces=setInterval(function()
      {
        nuevosdulces()  //Funcion completar nuevos dulces
      },600)
  }
  if(rbh==1 || rbv==1)
  {
    $(".elemento").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-end")
    $(".activo").hide("pulsate",1000,function(){
      var scoreTablerotmp=$(".activo").length;
      $(".activo").remove("img")
      scoreTablero=scoreTablero+scoreTablerotmp;
      $("#scoreTablero-text").html(scoreTablero)  //Cambiar puntuacion
    })
  }

  if(rbh==0 && rbv==0 && elementosEnTabla==49)
  {
    $(".elemento").draggable({
      disabled: false,
      containment: ".panel-tablero",
      revert: true,
      revertDuration: 0,
      snap: ".elemento",
      snapMode: "inner",
      snapTolerance: 40,
      start: function(event, ui){
        mov=mov+1;
        $("#movimientos-text").html(mov)
      }
    });
  }

  $(".elemento").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap($(droppedOn));
      }while(espera==0)
      rbh=horizontal()  //funcion busqueda dulces horizontal
      rbv=vertical()    //funcion buscar dulces vertical
      if(rbh==0 && rbv==0)
      {
        dropped.swap($(droppedOn));
      }
      if(rbh==1 || rbv==1)
      {
        clearInterval(agregaDulces);
        clearInterval(tiempoEliminar);   //desactivar funcion desplazamiento()
        tiempoEliminar=setInterval(function(){tiempoEliminarhorver()},150)  //activar funcion tiempoEliminarhorver
      }
    },
  });
}
//------------------------------------------------------------------------------
//---------Funcion para intercambiar dulces-------------------------------------
jQuery.fn.swap = function(b)
{
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};
//------------------------------------------------------------------------------
//---------Funcion de nuevos dulces---------------------------------------------
function nuevosdulces()
{
  $(".elemento").draggable({ disabled: true });
  //alert("pase")
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
      lencol[j-1]=$(".col-"+j).children().length;
  }
  if(bnewd==0)
  {
    for(var j=0;j<7;j++)
    {
      lenres[j]=(7-lencol[j]);
    }
    maximo=Math.max.apply(null,lenres);
    contador=maximo;
  }
  if(maximo!=0)
  {
    if(bnewd==1)
    {
      for(var j=1;j<8;j++)
      {
        if(contador>(maximo-lenres[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(lenres[j-1])+")").remove("img")
        }
      }
    }
    if(bnewd==0)
    {
      bnewd=1;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(lenres[k-1]-1);j++)
        {
            $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(contador>(maximo-lenres[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
      }
    }
  }
  if(contador==1)
  {
      clearInterval(agregaDulces);
      tiempoEliminar=setInterval(function(){tiempoEliminarhorver()},150)
  }
  contador=contador-1;
}
//------------------------------------------------------------------------------
//----------funcion de busqueda horizontal de dulces----------------------------
function horizontal()
{
  var bh=0;
  for(var j=1;j<8;j++)
  {
    for(var k=1;k<6;k++)
    {
      var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
      var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
      var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          bh=1;
      }
    }
  }
  return bh;
}
//------------------------------------------------------------------------------
//----------Funcion de busqueda vertical de dulces------------------------------
function vertical()
{
  var bv=0;
  for(var l=1;l<6;l++)
  {
    for(var k=1;k<8;k++)
    {
      var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
      var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
      var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo")
          bv=1;
      }
    }
  }
  return bv;
}

// Esta función arroja un numero entero de entre 1 y 4 que su salida se usa para generar el nombre del dunce que se colocará en la pantalla.
  function numeroAleatorio() {
    var a = Math.random()*10 ;
    var arr = a.toString().split('') ;
    a = arr[0]
    return a
 }
