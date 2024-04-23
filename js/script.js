const clickBtn = document.querySelectorAll(".button")
const tbody = document.querySelector("tbody")
let carrito =[]


clickBtn.forEach(btn => {
  btn.addEventListener("click", selecionarItem)
})

/* Funcion para seleccionar el item y agregarlo al carrito de compra*/
function selecionarItem(e){
  const btnItem = e.target
  const item = btnItem.closest(".card")
  const itemTitle = item.querySelector(".card-title").textContent
  const itemPrice = item.querySelector(".precio").textContent
  const itemImage = item.querySelector(".card-img-top").src
  
  const nuevoItem = {
    titulo: itemTitle,
    precio: itemPrice,
    imagen: itemImage,
    cantidad: 1
  }
  agregarItemACarrito(nuevoItem)
  
}

/* Funcion para guardar los items en el carrito de compra*/

function agregarItemACarrito(nuevoItem){
  //Para las alerts de producto añadido

  const alert = document.querySelector(".alert")
  setTimeout(() => {
    alert.classList.add("hidden")
  },2000)
  alert.classList.remove("hidden")



  const inputItem = tbody.getElementsByClassName("input-item")
  for(let i = 0; i < carrito.length; i++){
    if(carrito[i].titulo.trim() === nuevoItem.titulo.trim()){
      carrito[i].cantidad ++;
      const inputValue = inputItem[i]
      inputValue.value++;
      totalCarrito()
      return null;
    }
  }
  carrito.push(nuevoItem)

  renderizarCarrito()
} 

function renderizarCarrito(){
  tbody.innerHTML = ""
  carrito.map((item) => {
    const tr = document.createElement("tr")
    tr.classList.add("item-carrito")
    const content = `
      <th scope="row">1</th>
        <td class="table-cantidad">
          <div class=" mb-3 justify-content-between form-group">
            <input type="number" value=${item.cantidad} class="form-control input-item" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="Ingrese la cantidad" readondly>
          </div>
        </td>
        <td class="table-productos">
          <img src="${item.imagen}" alt="">
          <h6 class="title">${item.titulo}</h6>
        </td>
        <td class="table-precio">
          <span>${item.precio}</span>
        </td>
        <td class="table-eliminar">
          <button type="button" class="btn btn-outline-primary btn-sm delete">Eliminar</button>
        </td>
      `
      tr.innerHTML = content
      tbody.append(tr)

      tr.querySelector(".delete").addEventListener("click", eliminarItemCarrito )
      tr.querySelector(".input-item").addEventListener("change", sumaCantidad)
  })  
  totalCarrito()
}
/**/
function totalCarrito(){
  let total = 0
  const itemsTotal = document.querySelector(".total")
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''))
    total = total + precio * item.cantidad
  })

  itemsTotal.innerHTML = `Total a pagar $${total}`
  agregarAlLocalStorage()
} 
/*Funcion para que se puedan eliminar los items del carrito */

function eliminarItemCarrito(e) {
  const btnEliminar= e.target
  const tr = btnEliminar.closest(".item-carrito")
  const titulo = tr.querySelector(".title").textContent

  for(let i = 0; i < carrito.length; i++){
    if(carrito[i].titulo.trim() === titulo.trim()){
      carrito.splice(i, 1)
    }
  }
  const alert = document.querySelector(".remove")
  setTimeout(() => {
    alert.classList.add("remove")
  },2000)
  alert.classList.remove("remove")



  tr.remove()
  totalCarrito()
}
/* Funccion para que los inputs de cantidad, aumenten o disminuyan*/
function sumaCantidad(e){
  const sumaInput = e.target
  const tr = sumaInput.closest(".item-carrito")
  const titulo = tr.querySelector(".title").textContent;
  carrito.forEach(item => {
    if(item.titulo.trim() === titulo){
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      totalCarrito()
    }
  })
}
/*Esta funcion es para que se guarde el carrito en el LS,
se agregará a totalCarrito*/

function agregarAlLocalStorage(){
  localStorage.setItem("carrito", JSON.stringify(carrito))
}


/*Funcion para que cuando se refresque la pantalla se cargue buscará en el local storage
el carrito y lo parseará para guardarlo en una variable que podrá renderizar
el carrito*/

window.onload= function(){
  const storage = JSON.parse(localStorage.getItem('carrito'))
  if(storage){
    carrito = storage;
    return renderizarCarrito()
  }
}