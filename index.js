const tbody = document.querySelector(".tbody");
let carrito = [];

function addtoCarritoItem(button) {
  const item = button.closest(".card");
  const itemTitle = item.querySelector(".card-title").textContent;
  const itemPrice = item.querySelector(".precio").textContent;
  const itemImg = item.querySelector(".card-img-top").src;

  const newItem = {
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1,
  };

  addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
  const alert = document.querySelector(".alert");
  ////// ANIMACIÓN ///////////
  setTimeout(function () {
    alert.classList.add("hide");
  }, 2000);
  alert.classList.remove("hide");

  const InputElemento = tbody.getElementsByClassName("input__elemento");
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newItem.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemento[i];
      inputValue.value++;
      RecalcularCarritoTotal();
      return null;
    }
  }
  carrito.push(newItem);
  renderCarrito();
}

function renderCarrito() {
  tbody.innerHTML = "";
  carrito.map((item) => {
    const tr = document.createElement("tr");
    tr.classList.add("ItemCarrito");
    /////// USO DE JQUERY EXPLICITO ////////
    const Content = `
    
    <th scope="row">1</th>
                        <td class="table__productos">
                            <img src=${item.img} alt="">
                            <h6 class="title">${item.title}</h6>
                        </td>
                        <td class="table__precio">
                            <p>${item.precio}</p>
                        </td>
                        <td class="table__cantidad">
                            <input type="number" min="1" value=${item.cantidad} class="input__elemento">
                            <button class="delete btn btn-danger">x</button>
                        </td>
    `;
    tr.innerHTML = Content;
    tbody.append(tr);

    tr.querySelector(".delete").addEventListener("click", removeItemCarrito);
    tr.querySelector(".input__elemento").addEventListener(
      "change",
      sumaCantidad
    );
  });
  RecalcularCarritoTotal();
}

function RecalcularCarritoTotal() {
  let Total = 0;
  const itemCartTotal = document.querySelector(".itemCartTotal");
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ""));
    Total = Total + precio * item.cantidad;
  });

  itemCartTotal.innerHTML = `Total $${Total}`;
  updateLocalStorage();
}

function removeItemCarrito(e) {
  const buttonDelete = e.target;
  const tr = buttonDelete.closest(".ItemCarrito");
  const title = tr.querySelector(".title").textContent;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === title.trim());
    carrito.splice(i, 1);
  }

  const alert = document.querySelector(".remove");

  setTimeout(function () {
    alert.classList.add("remove");
  }, 2000);
  alert.classList.remove("remove");

  tr.remove();
  RecalcularCarritoTotal();
}

function sumaCantidad(e) {
  const sumaInput = e.target;
  const tr = sumaInput.closest(".ItemCarrito");
  const title = tr.querySelector(".title").textContent;
  carrito.forEach((item) => {
    if (item.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      RecalcularCarritoTotal();
    }
  });
}

function updateLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("carrito"));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }

  cargarItems();
};

function cargarItems() {
  $.ajax({
    url: "./index.json",
    type: "GET",
    dataType: "json",
  })
    .done(function (resultado) {
      console.log(resultado);
      //caso exitoso
      for (const item of resultado.Items) {
        console.log(item);
        $("#columna")
          .prepend(`<div class="col d-flex justify-content-center mb-4">
    <div class="card shadow mb-1 bg-white rounded" style="width: 20rem;">
        <h5 class="card-title pt-2 text-center">${item.title}</h5>
        <img src="${item.img}" class="card-img-top" alt="${item.title}">
        <div class="card-body text-dark-50 description">
            <h5><span class="precio">${item.precio}</span></h5>
            <div class="d-grid gap-2">
                <button onclick="addtoCarritoItem(this)" class="btn btn-dark button">Añadir al Carrito</a>
            </div>
        </div>
    </div>
</div>`);
      }
    })
    .fail(function (xhr, status, error) {
      //caso fallido (callback)
      console.log(xhr);
      console.log(status);
      console.log(error);
    });
}

// Fin de Compra
function finalizarCompra() {
  $(document).on("click", "#compra-finalizada", (e) => {
    $(".tbody").empty();
    $(".itemCartTotal").empty();
    const alert = document.querySelector(".fincarrito");
    setTimeout(function () {
      alert.classList.add("fincarrito");
    }, 2000);
    alert.classList.remove("fincarrito");
  });
}
