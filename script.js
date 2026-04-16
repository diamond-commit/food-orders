document.addEventListener("DOMContentLoaded", () => {

  // MODAL
  const modal = document.getElementById("modal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");

  if (openBtn && closeBtn && modal) {

    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    });
  }


  // FOOD DATA
  let currentFood = document.body.dataset.food;
 // base food price
  const foods = {
    jollof: { name: "Jollof Rice", price: 3000 },
    burger: { name: "Burger", price: 4500 },
    chips: { name: "Chips", price: 2500 },
    smallchops: { name: "Small Chops", price: 5000 },
    shawarma: { name: "shawarma", price: 4000 }
  };


  // ORDER STATE
  let order = {
    basePrice: foods[currentFood].price,
    extras: [],
    quantity: 1,
    delivery: "",
    protein: {
      chicken: { quantity: 0, price: 1500 },
      beef: { quantity: 0, price: 500 },
      fish: { quantity: 0, price: 1000 }
    }
  };


  // TOTAL UI
  let totalPrice = document.getElementById("total");


  // QUANTITY
  let plus = document.getElementById("plus");
  let minus = document.getElementById("minus");
  let amount = document.getElementById("amount");


  plus.addEventListener("click", () => {
    order.quantity++;
    amount.textContent = order.quantity;
    updateTotal();
  });

  minus.addEventListener("click", () => {
    if (order.quantity > 1) {
      order.quantity--;
      amount.textContent = order.quantity;
      updateTotal();
    }
  });


  // ADD ONS
  let addOn = document.querySelectorAll(".addOn");

  addOn.forEach(btn => {
    btn.addEventListener("click", () => {

      let type = btn.dataset.type;
      let value = btn.dataset.value;

      value = value ? value.toLowerCase() : value;

      // EXTRAS
      if (type === "extras") {

        if (order.extras.includes(value)) {
          order.extras = order.extras.filter(v => v !== value);
          btn.classList.remove("bg-brown", "text-white");
        } else {
          order.extras.push(value);
          btn.classList.add("bg-brown", "text-white");
        }
      }

      // PROTEIN
      else if (type === "protein") {

        order.protein[value].quantity++;

        let count = order.protein[value].quantity;

        btn.classList.add("bg-brown", "text-white");

        btn.innerHTML = value + " <span>(" + count + ")</span>";
      }

      updateTotal();
    });
  });


  // TOTAL CALC
  function updateTotal() {

    let proteinTotal = Object.values(order.protein).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    let total = (order.basePrice + proteinTotal) * order.quantity;

    totalPrice.textContent = "₦" + total.toLocaleString();
  }


  // INIT TOTAL
  updateTotal();


  // DELIVERY
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        order.delivery = radio.value;
      }
    });
  });
   
   // reset
  function resetOrder() {

  order = {
    basePrice: foods[currentFood].price,
    extras: [],
    quantity: 1,
    delivery: "",
    protein: {
      chicken: { quantity: 0, price: 1500 },
      beef: { quantity: 0, price: 500 },
      fish: { quantity: 0, price: 1000 }
    }
  };
}
  function resetUI() {

  // quantity
  document.getElementById("amount").textContent = 1;

  // total
  document.getElementById("total").textContent = "₦0";

  // radio buttons
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.checked = false;
  });

  // extras + protein buttons reset styles/text
  document.querySelectorAll(".addOn").forEach(btn => {
    btn.classList.remove("bg-brown", "text-white");

    // reset protein text back
    if (btn.dataset.type === "protein") {
      btn.innerHTML =btn.dataset.value +" <span class='text-sm text-gray-500'>₦" +  btn.dataset.price +"</span>";
    }
  });
}

document.getElementById("reset").addEventListener("click", () => {
  resetOrder();
  resetUI();
});

  // WHATSAPP BUILDER
  function buildWhatsAppMessage() {

    let proteinText = "";

    Object.entries(order.protein).forEach(([name, item]) => {
      if (item.quantity > 0) {
        proteinText += name + " x" + item.quantity + "\n";
      }
    });

    let proteinTotal = Object.values(order.protein).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    let total = (order.basePrice + proteinTotal) * order.quantity;

    let message =
      "Hi, I want to place my order\n\n" +
      "Food: " + foods[currentFood].name + "\n" +
      "Protein:" + (proteinText || "none") +
      "\nDelivery Method: " + (order.delivery || "-") + "\n" +
      "Quantity: " + order.quantity + "\n" +
      "Extras: " + (order.extras|| none) + "\n";

    return message;
  }


  // SEND WHATSAPP
  document.getElementById("order").addEventListener("click", function () {
    if (!order.delivery) {
  alert("Please select delivery method");
  return;
}
    if (currentFood === "jollof" || currentFood === "chips") {

    let hasProtein = Object.values(order.protein).some(
      item => item.quantity > 0
    );

    if (!hasProtein) {
      alert("You can't order this without selecting a protein");
      return;
    }
  }

    let message = buildWhatsAppMessage();

    let phone = "2347071943644";

    let url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

    window.open(url, "_blank");
  });

});