const sheet = document.querySelector("caption").className.replace(" bg-white", "");

/* Botões onde escolhe a Sheet */
const menu_buttons = document.querySelectorAll("li button")
menu_buttons.forEach(button => {
    button.parentElement.classList.remove("active");
    if(document.querySelector(`caption.${button.id}`))
        button.parentElement.classList.add("active");
    button.addEventListener("click", (event)=>window.location.href = `/sheets/${event.target.id}`);
})

/* Botões de adicionar nova linha */
document.querySelectorAll("button.add").forEach(button=>button.addEventListener("click", add_row));

const inputs_value = {};

function add_row(event){
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
    const button_cancel = div_buttons.querySelector(`#cancel-${row}`);
    button_cancel.addEventListener("click", cancel_add)
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
    event.target.closest("tr").classList.add("remove");

    const row = event.target.id.replace("del-", "");
    event.target.parentElement.querySelector("button.add").setAttribute("disabled", "true");
    const div_buttons = document.querySelector(`#btns-r${row}`);
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
/* Botões de editar uma celula */
const buttons_edit = document.querySelectorAll(".edit");
buttons_edit.forEach(button => button.addEventListener("click", edit_row));

function edit_row(event){
    const row = event.target.id.replace("edit-", "");
    const inputs = document.querySelectorAll(`#row-${row} td input`);
    inputs.forEach(input=>{
        input.removeAttribute("disabled");
        inputs_value[input.id] = input.value;
    });
    const div_buttons = document.querySelector(`#btns-r${row}`);
    div_buttons.classList.add("revel");
    div_buttons.querySelector(`#confirm-${row}`).addEventListener("click", confirm_edit);
    div_buttons.querySelector(`#cancel-${row}`).addEventListener("click", cancel_edit);
}

function confirm_edit(){
    const row = getRowId(this);
    const inputs = document.querySelectorAll(`#row-${row} td input`);

    var not_edit = false;
    inputs.forEach(input => {
        if(input.value!==inputs_value[input.id]){
            not_edit = true;
            return;
        }
    })
    if(not_edit){
        const form = document.createElement("form");
        form.setAttribute("action", `/edit/${sheet}`);
        form.setAttribute("method", "post");
        
        var _input = document.createElement("input");
        _input.setAttribute("name", "row");_input.setAttribute("value", row);
        form.appendChild(_input);
    
        const tds = document.querySelectorAll("thead tr td");
        const cols = [];
        for(const td of tds){
            const col = td.textContent.toLocaleLowerCase();
            if(col == "id"||col == "ações")
                continue;
            cols.push(col);
        }
        for(let i = 0; i < cols.length; i++){
            const _input = document.createElement("input");
            _input.setAttribute("name", cols[i]);
            _input.setAttribute("value", inputs[i].value);
            form.appendChild(_input);
        }
    
        document.body.appendChild(form);
        form.submit();

        const div_buttons = document.querySelector(`#btns-r${row}`);
        div_buttons.classList.remove("revel");

        document.querySelector(`#row-${row}`).classList.add("confirm")

        div_buttons.querySelector(`#confirm-${row}`).removeEventListener("click", confirm_edit);
        div_buttons.querySelector(`#cancel-${row}`).removeEventListener("click", cancel_edit);
        return;
    }
    inputs.forEach(input => {
        input.setAttribute("disabled", "true");
    })
    const div_buttons = document.querySelector(`#btns-r${row}`);
    div_buttons.classList.remove("revel");
    div_buttons.querySelector(`#confirm-${row}`).removeEventListener("click", confirm_edit);
    div_buttons.querySelector(`#cancel-${row}`).removeEventListener("click", cancel_edit);
    return;
}

function cancel_edit(){
    const row = getRowId(this);

    const inputs = document.querySelectorAll(`#row-${row} td input`);
    inputs.forEach(input=>input.setAttribute("disabled", "true"));

    const div_buttons = document.querySelector(`#btns-r${row}`);
    div_buttons.classList.remove("revel");
    div_buttons.querySelector(`#confirm-${row}`).removeEventListener("click", confirm_edit);
    div_buttons.querySelector(`#cancel-${row}`).removeEventListener("click", cancel_edit);
    return;
}

function getRowId(element){
    return element.id.split("-")[1];
}