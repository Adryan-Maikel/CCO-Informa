// const overlay = document.getElementById("overlay");
// overlay.style.left = "-100%"

var row_editing = null;
var editing = null;

const row_buttons_edit = document.getElementById("edit-rows-btn");

const button_cancel_edit = document.getElementById("cancel-edit");
const button_add_bottom = document.getElementById("add-bottom");
const button_add_top = document.getElementById("add-top");
const button_confirm_edit = document.getElementById("confirm-edit");
const button_excluir_row = document.getElementById("excluir-row");

var action = null;
var direction = null;

button_cancel_edit.addEventListener("click", ()=>{
    if(row_editing == null)return;
    row_editing.classList.remove("remove");
    reset_value_inputs(row_editing);toggle_inputs_disabled(row_editing);
    if(action)toggle_confirm();
    action = null;
    row_editing = null;
    editing = null;
    row_buttons_edit.classList.remove("revel");
});

button_add_top.addEventListener("click", ()=>{
    if(row_editing == null)return;
    clear_value_inputs(row_editing);
    toggle_confirm();
    action = "/add/cco-informa";
    direction = "top"
});

button_add_bottom.addEventListener("click", ()=>{
    if(row_editing == null)return;
    clear_value_inputs(row_editing);
    toggle_confirm();
    action = "/add/cco-informa";
    direction = "bottom";
});

button_excluir_row.addEventListener("click", ()=>{
    if(row_editing == null)return;
    row_editing.classList.add("remove");
    toggle_confirm();
    action = "/del/cco-informa";
})

const form = document.createElement("form")
button_confirm_edit.addEventListener("click", async()=>{
    if(row_editing == null)return;
    window.parent.postMessage("SUBMIT", "*");
    await new Promise(resolve => setTimeout(resolve, 600));

    const row = row_editing.id.replace("row-", "");
    form.setAttribute("action", action);
    form.setAttribute("method", "post");
    var _input = document.createElement("input");
    _input.setAttribute("name", "row")
    _input.setAttribute("value", row)
    form.appendChild(_input);
    if(direction){
        var _input = document.createElement("input");
        _input.setAttribute("name", "direction");_input.setAttribute("value", direction);
        form.appendChild(_input);
    }
    row_editing.querySelectorAll("input").forEach(input=>{
        var _input = document.createElement("input");

        _input.setAttribute("name", input.id.split("-")[1]);_input.setAttribute("value", input.value);
        form.appendChild(_input);
    })
    console.log(form);
    document.body.appendChild(form);
    form.submit();
})

function toggle_confirm(){
    button_confirm_edit.disabled = !button_confirm_edit.disabled;
    button_add_top.disabled = !button_add_top.disabled;
    button_add_bottom.disabled = !button_add_bottom.disabled;
    button_excluir_row.disabled = !button_excluir_row.disabled;
}


var inputs_values = {};
function toggle_inputs_disabled(row){row.querySelectorAll("input").forEach(input=>input.disabled = !input.disabled)}
function get_value_inputs(row){row.querySelectorAll("input").forEach(input=>inputs_values[input.id] = input.value)}
function reset_value_inputs(row){row.querySelectorAll("input").forEach(input=>{input.value = inputs_values[input.id]});inputs_values={}}
function clear_value_inputs(row){row.querySelectorAll("input").forEach(input=>input.value = "")}

document.querySelectorAll("ul").forEach(row=>{
    row.addEventListener("dblclick", edit_row);
})
function edit_row(event){
    const input = event.target.querySelector("input");
    if(row_editing||!input)return;
    row_editing = event.target.tagName == "ul"?event.target:event.target.closest("ul");
    toggle_inputs_disabled(row_editing);get_value_inputs(row_editing);
    row_buttons_edit.classList.add("revel");
    if(event.target.tagName != "ul")input.focus();
    document.addEventListener("input", _=>{if(!editing){toggle_confirm();editing = true;action = "/edit/cco-informa"}})
}



// aplicar filtros(_ >= 90){
//    display: none; esconder rows
//}

// ocultar coluna a 
//document.querySelectorAll("li.A").forEach(li=>li.style.display = "none")