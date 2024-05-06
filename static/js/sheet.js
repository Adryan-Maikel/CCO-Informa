const sheet = document.querySelector("caption").className.replace(" bg-white", "");
const cols = document.querySelectorAll("thead tr td");

/* Botões onde escolhe a Sheet */
document.querySelectorAll("li button").forEach(button=>{
    document.querySelector(`caption.${button.id}`)
    ?button.parentElement.classList.add("active")
    :button.parentElement.classList.remove("active");
    button.addEventListener("click", event=>window.location.href = `/sheets/${event.target.id}`);
})

/* Botões de adicionar nova linha */
document.querySelectorAll("button.add").forEach(button=>button.addEventListener("click", add_row));

const inputs_value = {};

function add_row(event){
    const div_revel = document.querySelector("div.add-row.revel");

    if(div_revel)return div_revel.closest("tr").querySelector("input").focus();

    const row = event.target.id.replace("add-", "");
    const div_buttons = document.querySelector(`#btns-a${row}`);
    div_buttons.classList.add("revel");

    const tr = div_buttons.closest("tr");
    const inputs = tr.querySelectorAll("input");
    inputs.forEach(input=>{
        input.removeAttribute("disabled");
        inputs_value[input.id] = input.value;
        input.value = "";
    });
    inputs[0].focus();
    div_buttons.querySelector(`#cancel-${row}`).addEventListener("click", cancel_add)
    div_buttons.querySelector(`#bottom-${row}`).addEventListener("click", confirm_add)
    div_buttons.querySelector(`#top-${row}`).addEventListener("click", confirm_add)
}

function confirm_add(event){
    const target = event.target;

    const form = document.createElement("form");
    form.setAttribute("action", `/add/${sheet}`);
    form.setAttribute("method", "post");
    const names = ["direction","row"];
    target.id.split("-").forEach((name, i)=>{
        const _input = document.createElement("input");
        _input.setAttribute("name", names[i]);
        _input.setAttribute("value", name);
        form.appendChild(_input)
    });
    const inputs = target.closest("tr").querySelectorAll("input")
    cols.forEach((col, i)=>{
        const text = col.textContent.toLocaleLowerCase();
        if(text == "id"||text == "ações")
            return;
        const __input = document.createElement("input");
        __input.setAttribute("name", text);
        __input.setAttribute("value", inputs[i-1].value);
        form.appendChild(__input)
    });
    document.body.appendChild(form);
    form.submit();
}

function cancel_add(event){
    const div_buttons = event.target.parentElement;
    div_buttons.classList.remove("revel");
    
    const tr = div_buttons.closest("tr");
    const inputs = tr.querySelectorAll("input");
    inputs.forEach(input=>{
        input.value = inputs_value[input.id];
        input.setAttribute("disabled", "true");
    });
    event.target.removeEventListener("click", cancel_add);
}

/* Botões de deletar uma linha */
document.querySelectorAll("button.del").forEach(input=>input.addEventListener("click", delete_row))
function delete_row(event){
    const div_revel = document.querySelector("div.confirmation.revel");
    if(div_revel)return div_revel.closest("tr").querySelector("input").focus();
    const target = event.target;
    const tr = target.closest("tr");
    tr.classList.add("remove");
    const row = tr.id.replace("row-", "");
    target.parentElement.querySelector("button.add").setAttribute("disabled", "true");
    const div_buttons = target.parentElement.querySelector(`#btns-r${row}`);
    div_buttons.querySelector(`#cancel-${row}`).addEventListener("click", cancel_del);
    div_buttons.querySelector(`#confirm-${row}`).addEventListener("click", confirm_del);
    div_buttons.classList.add("revel");
}

function cancel_del(event){
    const tr = event.target.closest("tr");
    tr.classList.remove("remove");
    const div_buttons = document.querySelector(`#btns-r${tr.id.replace("row-", "")}`);
    div_buttons.classList.remove("revel");

    tr.querySelector(`button.add`).removeAttribute("disabled");
    event.target.removeEventListener("click", cancel_del);
}

function confirm_del(event){
    const row = event.target.id.replace("confirm-", "");
    const div_buttons = document.querySelector(`#btns-r${row}`);
    div_buttons.classList.remove("revel");
    const tr = document.querySelector(`#row-${row}`);
    tr.classList.remove("remove");
    tr.classList.add("confirm");

    const form = document.createElement("form");
    form.setAttribute("action", `/del/${sheet}`);
    form.setAttribute("method", "post")
    const _input = document.createElement("input");
    _input.setAttribute("name", "row");
    _input.setAttribute("value", `${row}`);
    form.appendChild(_input);
    document.body.appendChild(form);
    form.submit();

    event.target.removeEventListener("click", confirm_del);
}
/* Botões de editar uma linha */
const buttons_edit = document.querySelectorAll(".edit");
buttons_edit.forEach(button=>button.addEventListener("click", edit_row));

function edit_row(event){
    const div_revel = document.querySelector("div.confirmation.revel");
    if(div_revel)return div_revel.closest("tr").querySelector("input").focus();

    const row = event.target.id.replace("edit-", "");
    const inputs = document.querySelectorAll(`#row-${row} td input`);
    inputs.forEach(input=>{input.removeAttribute("disabled");inputs_value[input.id] = input.value;});
    inputs[0].focus();
    const div_buttons = document.querySelector(`#btns-r${row}`);
    div_buttons.classList.add("revel");
    event.target.parentElement.querySelector("button.add").setAttribute("disabled", "true");
    div_buttons.querySelector(`#confirm-${row}`).addEventListener("click", confirm_edit);
    div_buttons.querySelector(`#cancel-${row}`).addEventListener("click", cancel_edit);
}

function confirm_edit(event){
    const row = event.target.id.split("-")[1];
    const inputs = document.querySelectorAll(`#row-${row} td input`);

    var edited = false;
    inputs.forEach(input=>{if(input.value!==inputs_value[input.id])return edited = true})
    if(!edited){
        inputs.forEach(input=>input.setAttribute("disabled", "true"));
        const div_buttons = document.querySelector(`#btns-r${row}`);
        div_buttons.classList.remove("revel");
        div_buttons.querySelector(`#confirm-${row}`).removeEventListener("click", confirm_edit);
        div_buttons.querySelector(`#cancel-${row}`).removeEventListener("click", cancel_edit);
        return;
    }
    const form = document.createElement("form");
    form.setAttribute("action", `/edit/${sheet}`);
    form.setAttribute("method", "post");
    
    const _input = document.createElement("input");
    _input.setAttribute("name", "row");
    _input.setAttribute("value", row);
    form.appendChild(_input);

    cols.forEach((col, i)=>{
        const text = col.textContent.toLocaleLowerCase();
        if(text == "id"||text == "ações")
            return;
        const __input = document.createElement("input");
        __input.setAttribute("name", text);
        __input.setAttribute("value", inputs[i - 1].value);
        form.appendChild(__input);
    });
    document.body.appendChild(form);
    form.submit();

    const div_buttons = document.querySelector(`#btns-r${row}`);
    div_buttons.classList.remove("revel");

    document.querySelector(`#row-${row}`).classList.add("confirm");

    div_buttons.querySelector(`#confirm-${row}`).removeEventListener("click", confirm_edit);
    div_buttons.querySelector(`#cancel-${row}`).removeEventListener("click", cancel_edit);
    return;
}

function cancel_edit(event){
    const row = event.target.id.split("-")[1];

    const inputs = document.querySelectorAll(`#row-${row} td input`);
    inputs.forEach(input=>input.setAttribute("disabled", "true"));

    const div_buttons = event.target.parentElement;
    div_buttons.classList.remove("revel");
    div_buttons.closest("tr").querySelector("button.add").removeAttribute("disabled");
    div_buttons.querySelector(`#confirm-${row}`).removeEventListener("click", confirm_edit);
    div_buttons.querySelector(`#cancel-${row}`).removeEventListener("click", cancel_edit);
    return;
}