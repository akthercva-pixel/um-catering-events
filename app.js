const CATEGORY_DATA = [["Stage Decorations", "stage", [["Normal", "choice"], ["Premium", "choice"], ["Luxury", "choice"], ["Ultra Premium", "choice"]]], ["Photography", "photo", [["Normal photography", "choice"], ["Photos with video", "choice"], ["Ultra modern photo shoot", "choice"], ["Entry video", "choice"], ["Instagram reel", "choice"]]], ["Background Music & Entertainment", "music", [["Speaker setup", "choice"], ["Kolkali", "choice"], ["Mutti paattu", "choice"], ["Arabic dance", "choice"], ["Oppana team", "choice"], ["Sufi dance", "choice"]]], ["Cars", "cars", [["BMW", "quantity"], ["Audi", "quantity"], ["Benz", "quantity"], ["Mini Cooper", "quantity"], ["Porsche", "quantity"], ["Jaguar", "quantity"], ["Thar", "quantity"], ["Fortuner", "quantity"], ["Vintage cars", "quantity"], ["Rolls Royce", "quantity"]]], ["Bridal Makeup", "bridal", [["Normal look", "choice"], ["Premium look", "choice"], ["Airbrush makeup", "choice"]]], ["Groom Makeup", "groom", [["Standard", "choice"], ["Premium look", "choice"]]], ["Welcome Drinks", "drinks", [["Apple", "multi"], ["Orange", "multi"], ["Grapes", "multi"], ["Pineapple", "multi"], ["Guava", "multi"], ["Mango", "multi"], ["Avocado", "multi"], ["Kiwi", "multi"], ["Passion fruit", "multi"], ["Watermelon", "multi"], ["Banana", "multi"], ["Mojitos", "multi"]]], ["Starters", "starters", [["Nuggets", "multi"], ["Strips", "multi"], ["Chicken rolls", "multi"], ["Beef rolls", "multi"], ["Chicken lollipops", "multi"]]], ["Food Counters", "counters", [["Arabic counter", "multi"], ["Buffet", "multi"], ["Normal setting", "multi"]]], ["Food Items", "food", [["Chicken biriyani", "multi"], ["Beef biriyani", "multi"], ["Mutton biryani", "multi"], ["Zurbian chicken", "multi"], ["Beef zurbian", "multi"], ["Ghee rice", "multi"], ["Nadan rice", "multi"], ["Chicken mandi", "multi"], ["Alfahm mandi", "multi"], ["Beef mandi", "multi"], ["Mutton mandi", "multi"], ["Kashmiri pulao", "multi"], ["Vegetable biryani", "multi"]]], ["Breads", "breads", [["Porotta", "multi"], ["Dosa", "multi"], ["Vellappam", "multi"], ["Chapathi", "multi"], ["Pathiri", "multi"], ["Idiyappam", "multi"], ["Live shawarma", "multi"]]], ["Curry Items", "curries", [["Chicken kuruma", "multi"], ["Beef palli curry", "multi"], ["Vegetable kuruma", "multi"], ["Mutton curry", "multi"]]], ["Sides", "sides", [["Beef varatt", "multi"], ["Chicken 65", "multi"], ["Chicken chilli", "multi"], ["Alfahm", "multi"], ["Breaded chicken", "multi"], ["Shawaya", "multi"], ["Fish fry", "multi"]]], ["Payasam", "payasam", [["Semiya", "multi"], ["Palada", "multi"], ["Gothamb", "multi"], ["Paripp payasam", "multi"]]], ["Desserts", "desserts", [["Ice creams", "multi"], ["Jileebi", "multi"], ["Puddings", "multi"], ["Popcorn", "multi"], ["Cotton candy", "multi"], ["Gulab jamun", "multi"], ["Carrot halwa", "multi"]]], ["Additional Event Services", "extras", [["Fireworks", "quantity"], ["Catering boys", "quantity"], ["Security", "quantity"], ["Welcome boys", "quantity"], ["Welcome girls", "quantity"]]]];
const WHATSAPP_NUMBER = "919744562904";
const container = document.getElementById("categories");
const state = {};
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function renderCategories() {
  CATEGORY_DATA.forEach(([title,key,items], index) => {
    const section = document.createElement("section");
    section.className = "form-card service-card";
    section.innerHTML = `<div class="card-heading"><span class="step-number">${String(index+2).padStart(2,"0")}</span><div><h3>${title}</h3><p>${key==="cars" || key==="extras" ? "Select the items and required quantity." : key==="photo" ? "Choose services and specify hours where relevant." : "Select the options you would like included."}</p></div></div><div class="options-grid" id="opts-${key}"></div>${key==="photo" ? '<div class="hours-field"><label>Photography duration (hours)<input type="number" min="1" max="24" id="photo-hours" placeholder="Select number of hours"></label><label>Photo/video notes (optional)<input id="photo-notes" placeholder="Coverage, timings or style"></label></div>' : ''}${key==="food" ? '<p class="small-note">Planning guide: 1 kg serves approximately 6 people. Final food quantities are set by the UM team in the admin dashboard.</p>' : ''}`;
    const opts = section.querySelector(`#opts-${key}`);
    items.forEach(([item,type]) => {
      const id = `${key}-${slug(item)}`;
      const wrap = document.createElement("label");
      wrap.className = "option-tile";
      if (type === "choice") {
        wrap.innerHTML = `<input type="radio" name="group-${key}" value="${item}"><span class="fake-control"></span><span class="option-name">${item}</span>`;
      } else if (type === "quantity") {
        wrap.innerHTML = `<input type="checkbox" id="${id}" data-key="${key}" data-item="${item}"><span class="fake-control"></span><span class="option-name">${item}</span><input class="qty-input" type="number" min="1" value="1" aria-label="${item} quantity" disabled>`;
        const check = wrap.querySelector('input[type="checkbox"]');
        const qty = wrap.querySelector(".qty-input");
        check.addEventListener("change", () => { qty.disabled = !check.checked; if(check.checked) qty.value = Math.max(1, Number(qty.value)||1); updateReview(); });
        qty.addEventListener("input", updateReview);
      } else {
        wrap.innerHTML = `<input type="checkbox" id="${id}" data-key="${key}" data-item="${item}"><span class="fake-control"></span><span class="option-name">${item}</span>`;
        wrap.querySelector("input").addEventListener("change", updateReview);
      }
      if(type==="choice") wrap.querySelector("input").addEventListener("change", updateReview);
      opts.appendChild(wrap);
    });
    container.appendChild(section);
  });
}
function selectedItems() {
 const result=[];
 CATEGORY_DATA.forEach(([title,key,items]) => {
   items.forEach(([item,type]) => {
     if(type==="choice") {
       const el=document.querySelector(`input[name="group-${key}"]:checked`);
       if(el && el.value===item) result.push({category:title,item,quantity:null});
     } else {
       const id=`${key}-${slug(item)}`, el=document.getElementById(id);
       if(el && el.checked) {
         const qty=el.type==="checkbox" && el.parentElement.querySelector(".qty-input");
         result.push({category:title,item,quantity:qty ? Math.max(1,Number(qty.value)||1) : null});
       }
     }
   });
 });
 const hrs=document.getElementById("photo-hours");
 if(hrs && hrs.value) result.push({category:"Photography",item:"Duration",quantity:`${hrs.value} hours`});
 const notes=document.getElementById("photo-notes");
 if(notes && notes.value.trim()) result.push({category:"Photography",item:"Notes",quantity:notes.value.trim()});
 return result;
}
function updateReview() {
 const list=document.getElementById("reviewList"), items=selectedItems();
 document.getElementById("selectionCount").textContent=items.filter(x=>x.item!=="Duration" && x.item!=="Notes").length;
 if(!items.length) {list.innerHTML='<p class="muted">No services selected yet.</p>';return;}
 list.innerHTML=items.map(x=>`<div class="review-row"><span><small>${x.category}</small><strong>${x.item}</strong></span><b>${x.quantity!==null ? (typeof x.quantity==="number" ? "Qty: "+x.quantity : x.quantity) : "Selected"}</b></div>`).join("");
}
function formDataObject() {
 const f=new FormData(document.getElementById("orderForm"));
 return {name:f.get("name"),phone:f.get("phone"),eventType:f.get("eventType"),date:f.get("date"),destination:f.get("destination"),guests:f.get("guests"),budget:f.get("budget")||"Not specified",notes:f.get("notes")||"None",delivery:f.get("delivery"),services:selectedItems(),createdAt:new Date().toISOString(),status:"Pending"};
}
function messageFor(order) {
 let lines=["NEW EVENT ENQUIRY — UM CATERING & EVENTS","",`Name: ${order.name}`,`Client WhatsApp: ${order.phone}`,`Event: ${order.eventType}`,`Date: ${order.date}`,`Destination: ${order.destination}`,`Guests: ${order.guests}`,`Budget: ${order.budget}`,"","SELECTED SERVICES:"];
 order.services.forEach(s=>lines.push(`• ${s.category} — ${s.item}${s.quantity!==null ? " ("+s.quantity+(typeof s.quantity==="number" ? " qty" : "")+")" : ""}`));
 lines.push("","Additional requirements: "+order.notes,"","Please review and prepare an estimate. Prices are for admin review only.");
 return lines.join("\n");
}
document.getElementById("orderForm").addEventListener("submit", e=>{
 e.preventDefault();
 const order=formDataObject();
 if(!order.services.some(s=>s.item!=="Duration" && s.item!=="Notes")) {
   document.getElementById("submitMessage").textContent="Please select at least one service before submitting.";
   return;
 }
 const delivery=order.delivery;
 if(delivery==="dashboard" || delivery==="both") {
   // Prototype storage only. A production shared dashboard must use a secure server/database.
   const orders=JSON.parse(localStorage.getItem("umce_orders")||"[]");
   order.id="UM"+Date.now().toString().slice(-8);
   orders.unshift(order);
   localStorage.setItem("umce_orders",JSON.stringify(orders));
 }
 document.getElementById("submitMessage").textContent=delivery==="dashboard" ? "Enquiry saved in this browser prototype. A live shared dashboard needs backend setup." : "Your WhatsApp message is ready. Please press Send in WhatsApp to deliver it.";
 if(delivery==="whatsapp" || delivery==="both") {
   const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageFor(order))}`;
   window.open(url,"_blank","noopener");
 }
 if(delivery!=="whatsapp") {
   document.getElementById("submitMessage").textContent += " For testing, open admin.html in this same browser to view locally saved enquiries.";
 }
});
document.getElementById("year").textContent=new Date().getFullYear();
renderCategories();
