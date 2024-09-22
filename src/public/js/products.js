async function addProduct(pid) {
  const cid = document.querySelector('#cartId').textContent;
  fetch(`/api/carts/${cid}/product/${pid}`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: 'Producto añadido al carrito',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Error al añadir el producto',
          icon: 'error',
        });
      }
    })
    .catch((error) => console.error(error));
}

async function gotoCart(cid) {
  window.location.href = `/carts/${cid}`;
}
