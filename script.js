const $ = id => document.getElementById(id);
const soloLetras = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g;

// Filtros en tiempo real para nombre y apellidos
["nombre","paterno","materno"].forEach(id=>{
  $(id).addEventListener("input", e=>{
    e.target.value = e.target.value.replace(soloLetras,"").toUpperCase().slice(0,100);
  });
});

// --- Fecha de nacimiento: llenar días (1-31) y años dinámicamente ---
const hoy = new Date();
const anioActual = hoy.getFullYear();

for (let d = 1; d <= 31; d++){
  const op = document.createElement("option");
  op.value = d; op.textContent = d;
  $("dia").appendChild(op);
}
for (let a = anioActual; a >= anioActual - 100; a--){
  const op = document.createElement("option");
  op.value = a; op.textContent = a;
  $("anio").appendChild(op);
}

function diasEnMes(mes, anio){
  return new Date(anio, mes, 0).getDate();
}
function fechaValida(dia, mes, anio){
  if (!dia || !mes || !anio) return false;
  dia = Number(dia); mes = Number(mes); anio = Number(anio);
  if (anio < anioActual - 100 || anio > anioActual) return false;
  return dia >= 1 && dia <= diasEnMes(mes, anio);
}

// --- Número de tarjeta: solo dígitos, máximo 16, agrupados de 4 en 4 ---
$("tarjeta").addEventListener("input", e=>{
  const digitos = e.target.value.replace(/\D/g,"").slice(0,16);
  e.target.value = digitos.replace(/(.{4})/g,"$1 ").trim();
});

// --- Correo: usuario con letras, números, puntos y guiones ---
$("email").addEventListener("input", e=>{
  e.target.value = e.target.value.replace(/[^a-zA-Z0-9._-]/g,"").toLowerCase().slice(0,30);
});

function marcar(id, ok){
  const f = $("f-"+id);
  f.classList.toggle("error", !ok);
  f.classList.toggle("valid", ok);
  return ok;
}
const validaNombre = v => v.trim().length >= 1 && v.length <= 100 && !/[^A-ZÁÉÍÓÚÜÑ ]/.test(v);

$("form").addEventListener("submit", e=>{
  e.preventDefault();

  const v = {
    nombre: $("nombre").value.trim().replace(/\s+/g," "),
    paterno: $("paterno").value.trim().replace(/\s+/g," "),
    materno: $("materno").value.trim().replace(/\s+/g," "),
    dia: $("dia").value,
    mes: $("mes").value,
    anio: $("anio").value,
    tarjeta: $("tarjeta").value.replace(/\s/g,""),
    email: $("email").value,
    dominio: $("dominio").value
  };

  const r = [
    marcar("nombre", validaNombre(v.nombre)),
    marcar("paterno", validaNombre(v.paterno)),
    marcar("materno", validaNombre(v.materno)),
    marcar("fecha", fechaValida(v.dia, v.mes, v.anio)),
    marcar("tarjeta", /^\d{13,16}$/.test(v.tarjeta)),
    marcar("email", /^[a-z0-9]+([._-][a-z0-9]+)*$/.test(v.email) && v.email.length >= 6 && v.email.length <= 30)
  ];

  if (r.every(Boolean)) {
    const meses = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const tarjetaOculta = "**** **** **** " + v.tarjeta.slice(-4);

    $("summary").innerHTML =
      "<b>Nombre:</b> " + v.nombre + " " + v.paterno + " " + v.materno + "<br>" +
      "<b>Fecha de nacimiento:</b> " + v.dia + " de " + meses[Number(v.mes)] + " de " + v.anio + "<br>" +
      "<b>Tarjeta:</b> " + tarjetaOculta + "<br>" +
      "<b>Email:</b> " + v.email + "@" + v.dominio;

    $("form").style.display = "none";
    $("success").style.display = "block";
    window.scrollTo(0,0);
  } else {
    const first = document.querySelector(".field.error input, .field.error select");
    if (first) first.focus();
  }
});

$("again").addEventListener("click", ()=>{
  $("form").reset();
  document.querySelectorAll(".field").forEach(f=>f.classList.remove("error","valid"));
  $("success").style.display = "none";
  $("form").style.display = "block";
});
